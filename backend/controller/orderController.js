const Order = require('../Models/orderModel');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // If seller, we'll do a specific filtering
if (req.user.role === 'seller') {
  // Find orders that have at least one product from this seller
  const orders = await Order.find({
    'products.seller_id': req.user._id
  })
  .populate({
    path: 'products.product',
    populate: [
      {
        path: 'categoryId',
        select: 'name'
      },
      {
        path: 'subcategoryId',
        select: 'name'
      }
    ]
  })
  .populate('userId', 'name phone email');

  // Transform orders to only include this seller's products
  const sellerOrders = orders.map(order => {
    // Filter products that belong to this seller
    const sellerProducts = order.products.filter(
      productItem => productItem.seller_id.toString() === req.user._id.toString()
    );

    // If there are no matching products, skip this order
    if (sellerProducts.length === 0) return null;

    return {
      ...order.toObject(),
      products: sellerProducts,
      totalPrice: sellerProducts.reduce(
        (total, item) => total + (item.price * item.quantity), 
        0
      )
    };
  }).filter(order => order !== null); // Remove null values (orders without matching products)

  return res.status(200).json({
    success: true,
    data: sellerOrders,
    message: 'Seller-specific orders fetched successfully'
  });
}


    // For admin or other roles, fetch all orders normally
    const orders = await Order.find()
      .populate({
        path: 'products.product',
        populate: [
          {
            path: 'categoryId',
            select: 'name'
          },
          {
            path: 'subcategoryId',
            select: 'name'
          },
        ]
      })
      .populate({
        path: 'products.seller_id',
        select: 'name phone email address'
      })
      .populate('userId', 'name email phone address');

    res.status(200).json({
      success: true,
      data: orders,
      message: 'All orders fetched successfully'
    });
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId', 'name price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalPrice, status } = req.body;

    const newOrder = new Order({
      userId,
      products,
      totalPrice,
      status: status || 'Pending', // Default status is 'Pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
