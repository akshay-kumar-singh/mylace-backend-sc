const express = require('express');
const router = express.Router();
const { sendSubscriptionEmail } = require('../utils/mailer');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    await sendSubscriptionEmail(email);
    res.json({ msg: 'Thank you for subscribing!' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
