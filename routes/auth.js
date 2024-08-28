const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();
const { sendRegistrationEmail, sendPasswordResetEmail } = require('../utils/mailer');

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    user = new User({
      email,
      password,
      verificationToken,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Send registration email
    await sendRegistrationEmail(email, verificationToken);

    res.json({ msg: 'Signup successful. Please check your email to verify your account.' });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Email Verification Route
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token or user does not exist' });
    }

    // if (user.isVerified) {
    //   return res.status(200).json({ msg: 'Email is already verified. You can now log in.' });
    // }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after successful verification
    await user.save();

    res.json({ msg: 'Email successfully verified. You can now log in.' });
  } catch (error) {
    console.error('Verification Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'User does not exist' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ msg: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Request Password Reset Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    await sendPasswordResetEmail(email, token);

    res.json({ msg: 'Password reset link sent' });
  } catch (error) {
    console.error('Password Reset Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
})

module.exports = router;
