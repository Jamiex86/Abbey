require('dotenv').config({ path: './server/.env' });
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
console.log("Test Variable:", process.env.TEST_VAR)
const path = require('path');

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Create checkout session
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Kiln Dried Logs',
            images: ['https://yourwebsite.com/logs.jpg'],
          },
          unit_amount: 5000, // Amount in cents (5000 = $50)
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

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
