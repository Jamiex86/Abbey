let basket = [];
let totalAmount = 0;

// Function to add products to the basket
function addToBasket(productId, productName, productPrice) {
  basket.push({ productId, productName, productPrice });
  totalAmount += productPrice;
  updateBasket();
}

// Function to remove a product from the basket
function removeFromBasket(index) {
  totalAmount -= basket[index].productPrice;
  basket.splice(index, 1);
  updateBasket();
}

// Function to update the basket UI
function updateBasket() {
  const basketDiv = document.getElementById('basket');
  const totalSpan = document.getElementById('total');
  const checkoutButton = document.getElementById('checkout-button');

  basketDiv.innerHTML = '';
  basket.forEach((item, index) => {
    basketDiv.innerHTML += `<p>${item.productName} - £${(item.productPrice / 100).toFixed(2)} <button onclick="removeFromBasket(${index})">Remove</button></p>`;
  });

  totalSpan.innerText = (totalAmount / 100).toFixed(2);
  checkoutButton.disabled = basket.length === 0;
}

// Function to show popup warning before checkout
function checkout() {
  const hasStackLogs = basket.some(item => item.productId === 'stack_logs');
  if (!hasStackLogs) {
    document.getElementById('popup-warning').style.display = 'block';
  } else {
    proceedToCheckout();
  }
}

// Function to proceed to checkout
function proceedToCheckout() {
  document.getElementById('popup-warning').style.display = 'none';
  fetch('/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(basket),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(session => {
    const stripe = Stripe('pk_test_51Q4J4CGKNAA22AV8p1pxR1qQy3plxKPqmTH00Vq7qf2vNxJZMOAwCoGbGuYGwIWim90LEwKYWdRCpqrU4BD8zaNN008FQd4fyh');
    stripe.redirectToCheckout({ sessionId: session.id });
  })
  .catch(error => console.error('Error:', error));
}

// Function to close the popup without proceeding
function closePopup() {
  document.getElementById('popup-warning').style.display = 'none';
}