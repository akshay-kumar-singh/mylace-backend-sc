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
  const verificationLink = `http://localhost:5173/verify-email/${token}`;
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
  const resetLink = `http://localhost:5173/reset-password/${token}`;
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
    subject: 'Thank you for subscribing!',
    text: 'Thank you for subscribing to My Lace Studio! Stay tuned for updates!',
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendRegistrationEmail, sendPasswordResetEmail,sendSubscriptionEmail };
