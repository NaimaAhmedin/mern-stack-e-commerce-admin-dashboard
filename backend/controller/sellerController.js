const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all sellers
// @route   GET /api/sellers
// @access  Private (Content Admin)
exports.getAllSellers = asyncHandler(async (req, res) => {
  try {
    // Construct query to find only sellers
    const queryObj = { 
      ...req.query, 
      role: 'seller' 
    };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    
    let query = User.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v -password');
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const sellers = await query;
    const totalSellers = await User.countDocuments({ role: 'Seller' });

    res.status(200).json({
      status: 'success',
      results: sellers.length,
      totalSellers,
      data: sellers
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @desc    Get single seller
// @route   GET /api/sellers/:id
// @access  Private (Content Admin)
exports.getSeller = asyncHandler(async (req, res) => {
  try {
    const seller = await User.findOne({ 
      _id: req.params.id, 
      role: 'Seller' 
    });

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'No seller found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @desc    Update seller status
// @route   PATCH /api/sellers/:id/status
// @access  Private (Content Admin)
exports.updateSellerStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    const seller = await User.findOneAndUpdate(
      { 
        _id: req.params.id, 
        role: 'Seller' 
      }, 
      { 
        'sellerDetails.sellerStatus': status, 
        updatedAt: Date.now() 
      }, 
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'No seller found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: seller
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// @desc    Delete seller
// @route   DELETE /api/sellers/:id
// @access  Private (Content Admin)
exports.deleteSeller = asyncHandler(async (req, res) => {
  try {
    const seller = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'Seller' 
    });

    if (!seller) {
      return res.status(404).json({
        status: 'error',
        message: 'No seller found with that ID'
      });
    }

    // Delete profile image from Cloudinary if exists
    if (seller.profileImage && seller.profileImage.public_id) {
      await cloudinary.uploader.destroy(seller.profileImage.public_id);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
