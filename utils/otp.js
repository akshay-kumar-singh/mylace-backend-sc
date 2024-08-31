// // /backend/utils/otp.js
// const crypto = require('crypto');
// const twilio = require('twilio');

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = new twilio(accountSid, authToken);

// const generateOTP = () => {
//   return crypto.randomInt(100000, 999999).toString();
// };

// const sendOTP = (mobile, otp) => {
//   return client.messages.create({
//     body: `Your OTP is ${otp}`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: mobile,
//   });
// };

// module.exports = { generateOTP, sendOTP };
