const express = require('express');
const path = require('path');
const mercadopago = require('mercadopago');
const app = express();
const port = 3000;

mercadopago.configure({
  platform_id: '87084590',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
});

// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura Express para parsear JSON
app.use(express.json());

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/templates/index.html'));
});
// Ruta para servir el archivo pago.html
app.get('/pago', (req, res) => {
  const prefId = req.query.pref_id;
  res.sendFile(path.join(__dirname, 'public', '/templates/pago.html'));
});

app.post('/crear-preferencia', async (req, res) => {
  const carrito = req.body.carrito;
  if (!Array.isArray(carrito) || carrito.length === 0) {
    return res.status(400).send('El carrito está vacío o no es un array');
  }
  const client = new mercadopago.MercadoPagoConfig({ accessToken: 'APP_USR-6166430521539753-082822-da9db6259a545289531e0ce0e7066be4-87084590'});
  const preference = new mercadopago.Preference(client);
  preference.create({
    body: {
      items: carrito.map(item => ({
        title: item.title,         
        unit_price: item.unit_price, 
        quantity: item.quantity
      })),
      back_urls: {
        success: 'http://test.com/success',
        failure: 'http://test.com/failure',
        pending: 'http://test.com/pending',
      },
      operation_type: 'regular_payment',
      auto_return: 'all',
    }
  })
  .then(response =>{
    // console.log(response);
    // console.log(response.id);
    res.json({ id: response.id });
  })
  .catch(console.log);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});



