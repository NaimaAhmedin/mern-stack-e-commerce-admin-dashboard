const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userController = require('./controller/userController');
const bodyParser = require('body-parser');

const app = express();

// Configure environment variables
dotenv.config({ path: './config.env' });

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/markato-e-commerce')
  .then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.error('DB connection error:', err));

// Routes
app.post('/user', userController.createUser);  // Create new user
app.post('/login', userController.loginUser);  // Login user
app.get('/', (req, res) => {  // Test server
  res.send('server is running');
});

// Start the server
app.listen(1337, () => {
  console.log('Server is up and running on port 1337');
});
