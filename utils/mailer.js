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
const sendRegistrationEmail = async (userEmail) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Registration Successful',
    text: `Hello,\n\nThank you for registering at My Lace Studio!\n\nBest regards,\nMy Lace Studio Team`,
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

module.exports = { sendRegistrationEmail, sendSubscriptionEmail };
