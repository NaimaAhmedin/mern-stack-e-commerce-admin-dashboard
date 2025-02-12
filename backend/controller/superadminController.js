const mongoose = require('mongoose');
const User = mongoose.model('User');
const Order = mongoose.model('Order');
const Product = mongoose.model('Product');
const Category = mongoose.model('Category');

// Get dashboard statistics for superadmin
exports.getDashboardStats = async (req, res) => {
    try {
        console.log('Fetching SuperAdmin dashboard stats...');
        
        // Total Users with detailed breakdown
        const totalUsers = await User.countDocuments();
        console.log('Total Users:', totalUsers);
        
        // User role distribution
        const userRoleStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log('User Role Distribution:', userRoleStats);
        
        // Total Admins (multiple admin roles) - UPDATED
        const totalAdmins = await User.countDocuments({ 
            role: { 
                $in: ['admin', 'content_admin', 'sales_admin', 'delivery_admin', 'ContentAdmin', 'DeliveryAdmin'] 
            } 
        });
        console.log('Total Admins:', totalAdmins);
        
        // Total Sellers
        const totalSellers = await User.countDocuments({ role: 'seller' });
        console.log('Total Sellers:', totalSellers);
        
        // Total Sales with more detailed aggregation
        const totalSalesResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: '$totalPrice' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        console.log('Total Sales Result:', totalSalesResult);

        // Additional statistics
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();

        const stats = {
            totalUsers,
            totalAdmins,
            totalSellers,
            totalSalesAmount: totalSalesResult[0]?.totalSalesAmount || 0,
            totalOrders: totalSalesResult[0]?.totalOrders || 0,
            totalProducts,
            totalCategories,
            userRoleDistribution: userRoleStats
        };

        console.log('Sending SuperAdmin stats:', stats);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('SuperAdmin Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};