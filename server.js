require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const app = express();

connectDB();

app.use(cors({
    origin: 'https://mylace.netlify.app', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Specify allowed methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  }));
app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscription', require('./routes/subscription')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
