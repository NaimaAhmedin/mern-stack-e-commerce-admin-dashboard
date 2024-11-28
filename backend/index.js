const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userController = require('./controller/userController');
const bodyParser = require('body-parser');

const app = express();

// Configure environment variables
dotenv.config({ path: './.env' });

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
   }).then(() => {
    console.log('DB connected');
  })
  .catch((err) => console.error('DB connection error:', err));

// Routes
app.post('/api/register', userController.createUser);  // Create new user
app.post('/api/login', userController.loginUser);  // Login user
app.get('/', (req, res) => {  // Test server
  res.send('server is running');
});


// Start the server
app.listen(1337, () => {
  console.log('Server is up and running on port 1337');
});

