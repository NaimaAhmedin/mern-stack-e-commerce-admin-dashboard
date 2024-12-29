const Category = require('../Models/categoryModel'); // Import the Category model
const Subcategory = require('../Models/subcategoryModel'); // Import the Subcategory model
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all categories with their subcategories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    const categoriesWithSubs = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({ categoryId: category._id });
        return {
          ...category.toObject(),
          subcategories
        };
      })
    );
    
    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categoriesWithSubs
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get a single category with its subcategories
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const subcategories = await Subcategory.find({ categoryId: category._id });
    const categoryWithSubs = {
      ...category.toObject(),
      subcategories
    };

    res.status(200).json({
      success: true,
      message: 'Category fetched successfully',
      data: categoryWithSubs
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validate that both name and image are provided
    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: 'Name and image are required.' });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'categories',
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    const newCategory = await Category.create({ 
      name, 
      image: cloudinaryResponse.secure_url
    });

    res.status(201).json({ 
      success: true, 
      data: newCategory 
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error.',
      error: error.message 
    });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Update name
    category.name = name || category.name;

    // Update image if a new file was uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categories',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      // Store only the secure URL
      category.image = cloudinaryResponse.secure_url;
    }

    await category.save();

    const subcategories = await Subcategory.find({ categoryId: category._id });
    const categoryWithSubs = {
      ...category.toObject(),
      subcategories
    };

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: categoryWithSubs
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating category',
      error: error.message 
    });
  }
};

// Delete a category and its subcategories
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete all subcategories of this category
    await Subcategory.deleteMany({ categoryId: category._id });

    // Delete the category
    await category.deleteOne();

    res.status(200).json({ 
      success: true,
      message: 'Category and its subcategories deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting category', 
      error: error.message 
    });
  }
};
