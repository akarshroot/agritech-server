// user.model.js
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const contributionTxSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Campaign',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    txHash: {
        type: String,
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

const ContributionTx = mongoose.model("ContributionTx", contributionTxSchema);

module.exports = ContributionTx;