// user.model.js
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

// Export the model

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;