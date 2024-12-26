const Promotion = require('../Models/promotionModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private (Content Admin)
exports.createPromotion = asyncHandler(async (req, res) => {
  try {
    const { 
      startDate, 
      endDate,
      link 
    } = req.body;

    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Promotion image is required'
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'promotions',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    // Create promotion
    const promotion = await Promotion.create({
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
      },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      link: link || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Promotion Creation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create promotion'
    });
  }
});

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private (Content Admin)
exports.getPromotions = asyncHandler(async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: promotions.length,
      data: promotions
    });
  } catch (error) {
    console.error('Fetch Promotions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotions'
    });
  }
});

// @desc    Get single promotion
// @route   GET /api/promotions/:id
// @access  Private (Content Admin)
exports.getPromotion = asyncHandler(async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Fetch Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch promotion'
    });
  }
});

// @desc    Update promotion
// @route   PUT /api/promotions/:id
// @access  Private (Content Admin)
exports.updatePromotion = asyncHandler(async (req, res) => {
  try {
    const { 
      startDate, 
      endDate,
      isActive,
      link 
    } = req.body;

    let promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Update fields
    promotion.startDate = startDate ? new Date(startDate) : promotion.startDate;
    promotion.endDate = endDate ? new Date(endDate) : promotion.endDate;
    promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;
    promotion.link = link !== undefined ? link : promotion.link;

    // Update image if a new file is uploaded
    if (req.file) {
      // Delete existing image from Cloudinary if it exists
      if (promotion.image && promotion.image.public_id) {
        await cloudinary.uploader.destroy(promotion.image.public_id);
      }

      // Upload new image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'promotions',
        transformation: [
          { width: 1200, height: 630, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      promotion.image = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url
      };
    }

    await promotion.save();

    res.status(200).json({
      success: true,
      data: promotion
    });
  } catch (error) {
    console.error('Update Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update promotion'
    });
  }
});

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private (Content Admin)
exports.deletePromotion = asyncHandler(async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Delete image from Cloudinary
    if (promotion.image && promotion.image.public_id) {
      await cloudinary.uploader.destroy(promotion.image.public_id);
    }

    // Delete the promotion
    await promotion.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Promotion deleted successfully'
    });
  } catch (error) {
    console.error('Delete Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete promotion'
    });
  }
});