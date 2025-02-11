const Product = require('../Models/productModel');

// Get monthly product statistics
exports.getMonthlyProductStats = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const monthlyStats = await Product.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lte: new Date(currentYear, 11, 31)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Convert to array of 12 months
        const monthsData = Array(12).fill(0);
        monthlyStats.forEach(stat => {
            monthsData[stat._id - 1] = stat.count;
        });

        res.status(200).json({
            success: true,
            data: monthsData
        });
    } catch (error) {
        console.error('Monthly stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly statistics',
            error: error.message
        });
    }
};

// Get recent products
exports.getRecentProducts = async (req, res) => {
    try {
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: 'categoryId',
                select: 'name'
            })
            .select('name categoryId price quantity createdAt');

        const formattedProducts = recentProducts.map(product => ({
            _id: product._id,
            name: product.name,
            category: product.categoryId ? product.categoryId.name : 'Uncategorized',
            status: product.quantity > 0 ? 'In Stock' : 'Out of Stock',
            price: product.price,
            createdAt: product.createdAt
        }));

        res.status(200).json({
            success: true,
            data: formattedProducts
        });
    } catch (error) {
        console.error('Recent products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent products',
            error: error.message
        });
    }
};
