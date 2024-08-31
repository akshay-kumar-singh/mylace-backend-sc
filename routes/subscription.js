const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const { sendSubscriptionEmail } = require('../utils/mailer');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  console.log('Subscription request received:', email); 

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    let existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ msg: 'You are already subscribed!' });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save(); 

    await sendSubscriptionEmail(email);

    res.json({ msg: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
