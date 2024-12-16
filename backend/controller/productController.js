const Product = require('../Models/productModel');

// Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate('categoryId', 'name')
//       .populate('subcategoryId', 'name');
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error });
//   }
// };

exports.getAllProducts = async (req, res) => {
  try {
    console.log('Getting all products, user:', req.user); // Debug user auth

    const products = await Product.find()
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');

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
    // Handle image files
    const images = req.files.map(file => file.filename);
    
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      amount: req.body.stock, // map stock to amount
      categoryId: req.body.category, // map category to categoryId
      subcategoryId: req.body.subcategory, // map subcategory to subcategoryId
      brand: req.body.brand,
      color: req.body.color,
      warranty: req.body.warranty,
      image: images[0] // use the first image
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error('Product creation error:', error);
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
    const { name, categoryId, subcategoryId, brand, color, price, amount, warranty, description, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, categoryId, subcategoryId, brand, color, price, amount, warranty, description, image },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
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
