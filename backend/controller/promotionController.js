const Promotion = require('../models/promotionModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private (Content Admin)
exports.createPromotion = asyncHandler(async (req, res) => {
  try {
    const { 
      image, 
      startDate, 
      endDate 
    } = req.body;

    // Create promotion
    const promotion = await Promotion.create({
      image,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
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
      image, 
      startDate, 
      endDate,
      isActive 
    } = req.body;

    let promotion = await Promotion.findById(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

    // Update fields
    promotion.image = image || promotion.image;
    promotion.startDate = startDate ? new Date(startDate) : promotion.startDate;
    promotion.endDate = endDate ? new Date(endDate) : promotion.endDate;
    promotion.isActive = isActive !== undefined ? isActive : promotion.isActive;

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
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found'
      });
    }

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