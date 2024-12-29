const Product = require('../Models/productModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

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
  try {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);
    console.log('Authenticated User:', req.user);

    // Validate authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Parse body fields, handling potential string conversions
    const { 
      name, 
      brand, 
      categoryId, 
      subcategoryId, 
      price, 
      quantity, 
      color, 
      warranty, 
      description 
    } = req.body;

    // Validate required fields
    if (!name || !categoryId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required fields.'
      });
    }

    // Validate numeric fields
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number.'
      });
    }

    // Upload images to Cloudinary
    const imageUploads = req.files ? await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
            transformation: [
              { width: 800, height: 600, crop: 'limit' }
            ]
          });
          
          // Remove local file after upload
          fs.unlinkSync(file.path);

          // Return only the URL
          return result.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          // Remove local file in case of upload error
          fs.unlinkSync(file.path);
          throw uploadError;
        }
      })
    ) : [];

    // Validate image uploads
    if (imageUploads.length > 5) {
      // Remove extra images from Cloudinary
      const extraImages = imageUploads.slice(5);
      await Promise.all(
        extraImages.map(async (img) => {
          await cloudinary.uploader.destroy(img.public_id);
        })
      );

      return res.status(400).json({
        success: false,
        message: 'Maximum of 5 images allowed.'
      });
    }

    // Create product object
    const productData = {
      name, 
      brand, 
      categoryId, 
      subcategoryId, 
      seller_id: req.user._id,
      price: numericPrice, 
      quantity: Number(quantity) || 0, 
      color, 
      warranty: Number(warranty) || 0, 
      description,
      images: imageUploads
    };

    // Create and save the product
    const newProduct = new Product(productData);
    await newProduct.save();

    console.log('=== PRODUCT CREATED SUCCESSFULLY ===');
    console.log('Product Details:', newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('=== ERROR CREATING PRODUCT ===');
    console.error('Full Error:', error);

    // Clean up any uploaded images in case of error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      brand, 
      categoryId, 
      subcategoryId, 
      price, 
      quantity, 
      color, 
      warranty, 
      description
    } = req.body;

    let existingImages = [];
    try {
      existingImages = JSON.parse(req.body.existingImages || '[]');
    } catch (e) {
      console.error('Error parsing existingImages:', e);
      existingImages = [];
    }

    // Find the existing product
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate seller ownership
    if (existingProduct.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product'
      });
    }

    // Upload new images to Cloudinary if files are present
    const newImageUploads = req.files ? await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
            transformation: [
              { width: 800, height: 600, crop: 'limit' }
            ]
          });
          
          // Remove local file after upload
          fs.unlinkSync(file.path);

          // Return only the URL
          return result.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          throw uploadError;
        }
      })
    ) : [];

    // Combine existing and new images
    const combinedImages = [
      ...existingImages,
      ...newImageUploads
    ].slice(0, 5); // Limit to 5 images

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      {
        name, 
        brand, 
        categoryId, 
        subcategoryId, 
        price: Number(price), 
        quantity: Number(quantity), 
        color, 
        warranty: Number(warranty), 
        description,
        images: combinedImages
      }, 
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Updated Product:', {
      id: updatedProduct._id,
      name: updatedProduct.name,
      images: updatedProduct.images
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Product Update Error:', error);
    
    // Cleanup any uploaded files in case of error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

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
