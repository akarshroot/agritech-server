// user.model.js
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const transactionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "KCO",
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
});

// Export the model

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;