const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { sendSubscriptionEmail } = require('../utils/mailer');

// Define the Subscription schema and model
const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    // Check if the email already exists in the database
    let existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ msg: 'You are already subscribed!' });
    }

    // Save the email to the database
    const newSubscription = new Subscription({ email });
    await newSubscription.save(); // Save the subscription to the database

    // Send the subscription email
    await sendSubscriptionEmail(email);

    res.json({ msg: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
