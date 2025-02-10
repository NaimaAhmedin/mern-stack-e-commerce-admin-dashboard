const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'ReadytoDelivery', 'Processing', 'Shipped', 'Delivered', 'Failed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   orderDate: {
//     type: Date,
//     default: Date.now
//   },
//   orderStatus: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   items: [
//     {
//       productID: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       productName: {
//         type: String,
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true
//       },
//       price: {
//         type: Number,
//         required: true
//       },
//       variant: {
//         type: String,
//       },
//     }
//   ],
//   totalPrice: {
//     type: Number,
//     required: true
//   },
//   shippingAddress: {
//     phone: String,
//     street: String,
//     city: String,
//     state: String,
//     postalCode: String,
//     country: String
//   },

//   paymentMethod: {
//     type: String,
//     enum: ['cod', 'prepaid']
//   },

//   couponCode: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Coupon'
// },
//   orderTotal: {
//     subtotal: Number,
//     discount: Number,
//     total: Number
//   },
//   trackingUrl: {
//     type: String
//   },
// });

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
