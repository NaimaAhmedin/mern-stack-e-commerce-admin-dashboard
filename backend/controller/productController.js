const Product = require('../Models/productModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

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
      .populate('seller_id', 'username'); // Optionally populate seller details

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
  // Use multer middleware to handle multiple file uploads
  uploadMultipleImages(req, res, async (err) => {
    // Log any multer errors for debugging
    console.log('Multer Upload Error:', err);
    console.log('Request Files:', req.files);
    console.log('Request Body:', req.body);
    console.log('Authenticated User:', req.user);

    // Handle multer upload errors
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false,
        message: 'File upload error',
        error: err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false,
        message: 'File upload failed',
        error: err.message 
      });
    }

    try {
      // Validate authenticated user
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Get the seller ID from the authenticated user
      const seller_id = req.user._id;

      // Get form fields from request body
      const { 
        name, 
        categoryId, 
        subcategoryId, 
        brand, 
        color, 
        price, 
        quantity, 
        warranty, 
        description 
      } = req.body;

      console.log('Received Data:', {
        name,
        categoryId,
        price,
        seller_id
      });

      // Validate required fields
      if (!name || !price || !categoryId) {
        return res.status(400).json({ 
          success: false,
          message: 'Name, price, and category are required' 
        });
      }

      // Validate uploaded images
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: 'At least one product image is required' 
        });
      }

      // Validate number of images
      if (req.files.length > 5) {
        return res.status(400).json({ 
          success: false,
          message: 'Maximum 5 images are allowed' 
        });
      }

      console.log('Starting Cloudinary uploads...');
      // Upload images to Cloudinary and get their URLs
      const imageUploadPromises = req.files.map(async (file) => {
        try {
          console.log('Uploading file:', file.path);
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products",
            resource_type: "auto"
          });
          console.log('Cloudinary upload result:', result);
          return result;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          throw uploadError;
        }
      });

      const uploadedImages = await Promise.all(imageUploadPromises);
      console.log('All images uploaded:', uploadedImages);

      // Prepare product data
      const productData = {
        name, 
        categoryId, 
        subcategoryId, 
        seller_id,
        brand, 
        color, 
        price: Number(price), 
        quantity: Number(quantity || 0), 
        warranty: Number(warranty || 0), 
        description,
        images: uploadedImages.map(image => ({
          public_id: image.public_id,
          url: image.secure_url
        }))
      };

      console.log('Final Product Data:', productData);
      const newProduct = new Product(productData);
      await newProduct.save();

      // Clean up temporary files
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error('Error deleting temp file:', unlinkError);
        }
      });

      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Product created successfully'
      });
    } catch (error) {
      console.error('Product creation error:', error);
      
      // Clean up any uploaded files on error
      if (req.files) {
        req.files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error deleting temp file:', unlinkError);
          }
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      });
    }
  });
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Update Product Request Body:', req.body);
    console.log('Product ID:', req.params.id);
    console.log('Authenticated User:', req.user);

    const { 
      name, 
      categoryId, 
      subcategoryId, 
      brand, 
      color, 
      price, 
      quantity, 
      warranty, 
      description,
      images // Change from image to images
    } = req.body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, price, and category are required' 
      });
    }

    // Validate numeric fields
    if (isNaN(price) || isNaN(quantity)) {
      return res.status(400).json({ 
        success: false,
        message: 'Price and quantity must be valid numbers' 
      });
    }

    // Find the existing product
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Check if the authenticated user is the seller of this product
    if (existingProduct.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to update this product' 
      });
    }

    const updateData = {
      name, 
      categoryId, 
      subcategoryId, 
      brand, 
      color, 
      price, 
      quantity, 
      warranty, 
      description
    };

    // Handle images update
    if (images && Array.isArray(images)) {
      updateData.images = images;
    }

    // Remove undefined fields to prevent overwriting with undefined
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    console.log('Final update data:', updateData);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run model validations
      }
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
    console.error('Product update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating product',
      error: error.message 
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
