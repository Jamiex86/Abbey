require('dotenv').config({ path: './server/.env' });
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
console.log("Test Variable:", process.env.TEST_VAR);
const path = require('path');

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { product } = req.body;
  
    let price;
    let productName;
    let productImage;
  
    if (product === 'logs') {
      // Kiln Dried Ash Logs – 1 x Barrow Bag
      price = 7000; // £70.00 in pence
      productName = 'Kiln Dried Ash Logs – 1 x Barrow Bag';
      productImage = 'https://yourwebsite.com/ash-logs.jpg';
    } else if (product === 'kindling') {
      // Kindling Net
      price = 450; // £4.50 in pence
      productName = 'Kindling Net';
      productImage = 'https://yourwebsite.com/kindling-net.jpg';
    } else {
      return res.status(400).send('Product not found');
    }
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              images: [productImage],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/`,
    });
  
    res.json({ id: session.id });
  });
  

// Serve static files (HTML)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get('/products.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/products.html'));
  });

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
