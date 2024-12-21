const Product = require('../Models/productModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
    files: 5 // Maximum 5 files
  } 
});

// Middleware for single image upload
const uploadSingleImage = upload.single('image');

// Middleware for multiple image upload (up to 5 images)
const uploadMultipleImages = upload.array('images', 5);

// Get all products (with optional seller filtering)
exports.getAllProducts = async (req, res) => {
  try {
    console.log('Getting all products, user:', req.user); // Debug user auth

    // Create a query object
    const query = {};

    // If a seller is requesting their own products, filter by seller_id
    if (req.user.role === 'seller') {
      query.seller_id = req.user._id;
    }

    const products = await Product.find(query)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name')
      .populate('seller_id', 'name email'); // Optionally populate seller details

    console.log('Found products:', products); // Debug found products

    res.status(200).json({
      success: true,
      data: products,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log('===== PRODUCT CREATION REQUEST =====');
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Authenticated User:', req.user ? {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    } : 'No user found');

    const { 
      name, 
      brand, 
      categoryId, 
      subcategoryId, 
      color, 
      price, 
      quantity, 
      warranty, 
      description 
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Product name is required' 
      });
    }

    if (!price) {
      return res.status(400).json({ 
        success: false,
        message: 'Product price is required' 
      });
    }

    if (!categoryId) {
      return res.status(400).json({ 
        success: false,
        message: 'Category is required' 
      });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'At least one product image is required' 
      });
    }

    // Validate and parse numeric fields
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity || 0);
    const parsedWarranty = parseInt(warranty || 0);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid price format' 
      });
    }

    // Handle local image uploads
    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);

    const product = await Product.create({
      name, 
      brand: brand || '', 
      categoryId, 
      subcategoryId, 
      seller_id: req.user._id,
      color: color || '', 
      price: parsedPrice, 
      quantity: parsedQuantity, 
      warranty: parsedWarranty, 
      description: description || '',
      images: imageUrls
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Product Creation Error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate key error',
        duplicateField: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error creating product',
      errorDetails: {
        name: error.name,
        message: error.message
      }
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log('===== PRODUCT UPDATE REQUEST =====');
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Product ID:', req.params.id);
    console.log('Authenticated User:', req.user ? {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    } : 'No user found');

    const { id } = req.params;
    const { 
      name, 
      brand, 
      categoryId, 
      subcategoryId, 
      color, 
      price, 
      quantity, 
      warranty, 
      description 
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Product name is required' 
      });
    }

    // Validate and parse numeric fields
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseInt(quantity || 0);
    const parsedWarranty = parseInt(warranty || 0);

    if (isNaN(parsedPrice)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid price format' 
      });
    }

    // Prepare update object
    const updateData = {
      name, 
      brand: brand || '', 
      categoryId, 
      subcategoryId, 
      color: color || '', 
      price: parsedPrice, 
      quantity: parsedQuantity, 
      warranty: parsedWarranty, 
      description: description || ''
    };

    // Handle image updates if files are present
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
      updateData.images = imageUrls;
    }

    // Find and update the product
    const product = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Product Update Error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Duplicate key error',
        duplicateField: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Error updating product',
      errorDetails: {
        name: error.name,
        message: error.message
      }
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
