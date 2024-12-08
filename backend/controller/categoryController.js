const Category = require('../Models/categoryModel'); // Import the Category model
const Subcategory = require('../Models/subcategoryModel'); // Import the Subcategory model
const path = require('path');

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
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file); // Log uploaded image file

    const { name } = req.body;

    // Validate that both name and image are provided
    if (!name || !req.file) {
      return res.status(400).json({ success: false, message: 'Name and image are required.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;  // Image URL from file upload
    const newCategory = await Category.create({ name, image: imageUrl });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error in createCategory:", error);  // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = { name };

    // Only update image if a new file was uploaded
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updateData.image = imageUrl;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

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

    res.status(200).json({ message: 'Category and its subcategories deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
