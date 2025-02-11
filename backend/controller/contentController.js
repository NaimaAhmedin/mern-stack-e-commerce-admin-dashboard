const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const Promotion = require('../Models/promotionModel');
const User = require('../Models/userSchema');
const Order = require('../Models/orderModel');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        console.log('Fetching dashboard stats...');
        
        const totalProducts = await Product.countDocuments();
        console.log('Total Products:', totalProducts);
        
        const totalCategories = await Category.countDocuments();
        console.log('Total Categories:', totalCategories);
        
        const totalPromotions = await Promotion.countDocuments();
        console.log('Total Promotions:', totalPromotions);
        
        const totalUsers = await User.countDocuments();
        console.log('Total Users:', totalUsers);
        
        const totalOrders = await Order.countDocuments();
        console.log('Total Orders:', totalOrders);

        const stats = {
            totalProducts,
            totalCategories,
            totalPromotions,
            totalUsers,
            totalOrders
        };

        console.log('Sending stats:', stats);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// Get recent products
exports.getRecentProducts = async (req, res) => {
    try {
        console.log('Fetching recent products...');
        
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('categoryId', 'name')
            .select('name categoryId price quantity createdAt');
        
        const formattedProducts = products.map(product => ({
            _id: product._id,
            name: product.name,
            category: product.categoryId ? product.categoryId.name : 'Uncategorized',
            status: product.quantity > 0 ? 'In Stock' : 'Out of Stock',
            price: product.price,
            createdAt: product.createdAt
        }));

        console.log('Recent Products:', formattedProducts);

        res.status(200).json({
            success: true,
            data: formattedProducts
        });
    } catch (error) {
        console.error('Error in getRecentProducts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent products',
            error: error.message
        });
    }
};

// Get active promotions
exports.getActivePromotions = async (req, res) => {
    try {
        console.log('Fetching active promotions...');
        
        const currentDate = new Date();
        const promotions = await Promotion.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate }
        }).populate('products');
        
        console.log('Active Promotions:', promotions);

        res.status(200).json({
            success: true,
            data: promotions
        });
    } catch (error) {
        console.error('Error in getActivePromotions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active promotions',
            error: error.message
        });
    }
};

// Get category statistics
exports.getCategoryStats = async (req, res) => {
    try {
        console.log('Fetching category statistics...');
        
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'products'
                }
            },
            {
                $project: {
                    name: 1,
                    productCount: { $size: '$products' }
                }
            }
        ]);
        
        console.log('Category Statistics:', categories);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error in getCategoryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category statistics',
            error: error.message
        });
    }
};

// Get recent orders
exports.getRecentOrders = async (req, res) => {
    try {
        console.log('Fetching recent orders...');
        
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        
        console.log('Recent Orders:', orders);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error in getRecentOrders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent orders',
            error: error.message
        });
    }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
    try {
        console.log('Fetching user statistics...');
        
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        console.log('User Statistics:', userStats);

        res.status(200).json({
            success: true,
            data: userStats
        });
    } catch (error) {
        console.error('Error in getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};
