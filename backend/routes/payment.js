const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Create a payment intent
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  const { amount, orderId } = req.body;
  
  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });

    // Update order with payment intent ID
    await pool.query(
      'UPDATE orders SET payment_intent_id = ? WHERE id = ? AND user_id = ?',
      [paymentIntent.id, orderId, req.user.id]
    );

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

// Webhook to handle Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update order status to processing
      await pool.query(
        'UPDATE orders SET status = "processing" WHERE payment_intent_id = ?',
        [paymentIntent.id]
      );
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Update order status to failed
      await pool.query(
        'UPDATE orders SET status = "payment_failed" WHERE payment_intent_id = ?',
        [failedPayment.id]
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;