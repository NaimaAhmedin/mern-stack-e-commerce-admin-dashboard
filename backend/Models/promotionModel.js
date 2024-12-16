const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Promotion image is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Validation to ensure end date is after start date
promotionSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('End date must be after start date'));
    }
    next();
});

// Method to check if promotion is currently active
promotionSchema.methods.isCurrentlyActive = function() {
    const now = new Date();
    return this.isActive && 
           now >= this.startDate && 
           now <= this.endDate;
};

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;