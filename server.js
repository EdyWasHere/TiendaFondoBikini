const express = require('express');
const path = require('path');
const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');
const app = express();
const port = 3000;


// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura Express para parsear JSON
app.use(express.json());

// Configura Mercado Pago con tu access token
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-6166430521539753-082822-da9db6259a545289531e0ce0e7066be4-87084590',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004',
  platform_id: '87084590'
});

const prefer = new Preference(client);

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

// weebHook  para MercadoPago
app.post('/otificaciones', (req, res) => {
  var respuesta = req;
  res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

// Ruta para servir el archivo pago.html
app.get('/pago', (req, res) => {
  const prefId = req.query.pref_id;
  res.sendFile(path.join(__dirname, 'public', 'templates', 'pago.html'));
});

// Ruta para crear una preferencia de pago
app.post('/create_preference', async (req, res) => {
  const { items, total } = req.body;
  // console.log("productos",items);

  try {
    const preference = await prefer.create({
      body: {
        items: items.map(item => ({
          id: 12,
          title: "Productos EWH",
          description: item.description,
          picture_url: "https://m.media-amazon.com/images/I/51dvJWhqPxL._AC_SX679_.jpg",
          category_id: 'botellas',
          unit_price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
        })),
        marketplace_fee: 0,
        payer: {
          name: 'Bob',
          surname: 'Toronja',
          email: 'edmundomacielmtz97@gmail.com',
          phone: {
            area_code: '33',
            number: '1353-0907',
          },
          address: {
            zip_code: '06233200',
            street_name: 'Street',
            street_number: 123,
          },
        },
        binary_mode: true,
        external_reference: '1643827245',
        marketplace: 'marketplace',
        operation_type: 'regular_payment',
        payment_methods: {
          default_payment_method_id: 'master',
          excluded_payment_types: [
            {
              id: 'ticket',
            },
          ],
          excluded_payment_methods: [
            {
              id: 'visa',
            },
          ],
          installments: 6,
          default_installments: 1,
        },
        shipments: {
          mode: 'custom',
          local_pickup: false,
          default_shipping_method: null,
          free_methods: [
            {
              id: 1,
            },
          ],
          cost: 10,
          free_shipping: false,
          dimensions: '10x10x20,500',
          receiver_address: {
            zip_code: '06000000',
            street_number: 123,
            street_name: 'Street',
            floor: '12',
            apartment: '120A',
          },
        },
        statement_descriptor: 'Tienda EWH',
      },
      back_urls: {
        success: "http://localhost:3000/success",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending"
      },
      auto_return: "all",
      payment_methods: {
        excluded_payment_types: [{
          id: "ticket"
        }]
      }
    });

    

    // Responder con el ID de la preferencia
    res.json({ id: preference.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating preference'});
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
