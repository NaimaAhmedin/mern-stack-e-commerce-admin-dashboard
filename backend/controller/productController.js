const Product = require('../Models/productModel');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name')
      .populate('subcategoryId', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
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
    const { name, categoryId, subcategoryId, price, amount, description, image } = req.body;

    const newProduct = new Product({
      name,
      categoryId,
      subcategoryId,
      price,
      amount,
      description,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, categoryId, subcategoryId, price, amount, description, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, categoryId, subcategoryId, price, amount, description, image },
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
