const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/roleBasedRoutes'); 
const errorMiddleware = require('./middlewares/errorMiddleware');
const path = require('path');

// Load environment variables
dotenv.config({ path: './.env' });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/routes', mainRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Global Error Handler
app.use(errorMiddleware);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start Server
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
