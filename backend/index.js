const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/roleBasedRoutes'); 
const promotionRoutes = require('./routes/promotionRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// Load environment variables
dotenv.config({ path: './.env' });

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:1337'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/routes', mainRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/products', productRoutes); // Add product routes
app.use('/api/orders', orderRoutes); // Add order routes
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
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
