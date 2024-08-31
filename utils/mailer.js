const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send registration email
const sendRegistrationEmail = async (userEmail, token) => {
  const verificationLink = `https://mylace.netlify.app/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Email Verification - My Lace Studio',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for signing up. Please click the button below to verify your email:</p>
      <a href="${verificationLink}" 
         style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
         Confirm Email
      </a>
      <p>If you did not sign up, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


// Function to send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `https://mylace.netlify.app/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset Request - My Lace Studio',
    html: `
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Please click the button below to reset your password:</p>
      <a href="${resetLink}" 
         style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
         Reset Password
      </a>
      <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
      <p>Best regards,<br/>My Lace Studio Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Function to send subscription email
const sendSubscriptionEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: '🎉 Welcome to My Lace Studio Family! 🎉',
    text: `
    Hi there!

    Thank you for subscribing to My Lace Studio! We're thrilled to have you as a part of our creative community.

    🌟 Here's what you can expect from us: 🌟
    - Exclusive previews of our latest collections.
    - Special discounts and offers, just for you!
    - Inspiring stories and tips to fuel your creativity.
    - Early access to our upcoming workshops and events.

    We can't wait to share our passion for lace-making with you. Stay tuned for exciting updates that will help you create, explore, and shine in your own unique way.

    If you ever have any questions or just want to say hello, feel free to reach out. We're always here for you!

    Warm regards,
    The My Lace Studio Team

    P.S. Keep an eye on your inbox for a special welcome gift just for you! 😉
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = { sendRegistrationEmail, sendPasswordResetEmail,sendSubscriptionEmail };
