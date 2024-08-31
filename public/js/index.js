// Maneja el clic en el botón de checkout
document.getElementById("checkout-btn").addEventListener("click", function () {

    $('#checkout-btn').attr("disabled", true);
  
    const orderData = {
      items: [
        {
            description: document.getElementById("product-description").innerText,
            price: document.getElementById("unit-price").innerText,
            quantity: document.getElementById("quantity").value
        }
      ]
    };
  
    fetch("http://localhost:3000/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(preference => {
        console.log(preference);
        createCheckoutButton(preference.id);
  
        $(".shopping-cart").fadeOut(500);
        setTimeout(() => {
          $(".container_payment").show(500).fadeIn();
        }, 500);
      })
      .catch(() => {
        alert("Unexpected error");
        $('#checkout-btn').attr("disabled", false);
      });
  });
  
  function createCheckoutButton(preferenceId) {
    const mp = new MercadoPago('APP_USR-a7edb66d-915e-4fd6-bcb0-2d935675dc96', {
        locale: 'es-MX'
      });
    const bricksBuilder = mp.bricks();
  

    const renderComponent = async (bricksBuilder) => {
        if (window.checkoutButton) window.checkoutButton.unmount();
        await bricksBuilder.create(
          'wallet',
          'button-checkout', // class/id where the payment button will be displayed
          {
            initialization: {
              preferenceId: preferenceId
            },
            customization: {
                texts: {
                valueProp: 'smart_option',
                },
            },
            callbacks: {
              onError: (error) => console.log(error),
              onReady: () => {}
            }
          }
        );
      };
      window.checkoutButton =  renderComponent(bricksBuilder);
  }
  
  // Maneja la actualización del precio
  function updatePrice() {
    let quantity = document.getElementById("quantity").value;
    let unitPrice = document.getElementById("unit-price").innerText;
    let amount = parseInt(unitPrice) * parseInt(quantity);
  
    document.getElementById("cart-total").innerText = "$ " + amount;
    document.getElementById("summary-price").innerText = "$ " + unitPrice;
    document.getElementById("summary-quantity").innerText = quantity;
    document.getElementById("summary-total").innerText = "$ " + amount;
  }
  
  document.getElementById("quantity").addEventListener("change", updatePrice);
  updatePrice();
  