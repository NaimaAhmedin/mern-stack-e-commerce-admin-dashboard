const Subcategory = require('../Models/subcategoryModel');
const Category = require('../Models/categoryModel');

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Subcategories fetched successfully',
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching subcategories', 
      error: error.message 
    });
  }
};

// Get subcategories by category ID
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ categoryId })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Subcategories fetched successfully',
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching subcategories', 
      error: error.message 
    });
  }
};

// Get a single subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)
      .populate('categoryId', 'name');
    
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Subcategory not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory fetched successfully',
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching subcategory', 
      error: error.message 
    });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    // Create subcategory
    const subcategory = new Subcategory({
      name,
      categoryId
    });

    const savedSubcategory = await subcategory.save();
    const populatedSubcategory = await savedSubcategory.populate('categoryId', 'name');
    
    // Send success response with the created subcategory
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: populatedSubcategory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating subcategory', 
      error: error.message 
    });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;
    
    // Check if the category exists if categoryId is being updated
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ 
          success: false,
          message: 'Category not found' 
        });
      }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(
      id,
      { name, categoryId },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Subcategory not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating subcategory', 
      error: error.message 
    });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        message: 'Subcategory not found' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Subcategory deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error deleting subcategory', 
      error: error.message 
    });
  }
};
