// user.model.js
const mongoose = require('mongoose');
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    imgUrl: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
    },
    region: {
        type: String
    },
    landArea: {
        type: String
    },
    phno: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        default: "0x879005ce3b64a880e1512d759cecb1bd857590f8"
    },
    crops: [
        {
            type: String,
            _id: false
        }
    ],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    orders:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Order'
    }],
    transactions: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Transaction'
    }],
    contributions: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ContributionTx'
    }],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    currentPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    verified: {
        type: Boolean,
        default: false
    },
    profileComplete: {
        type: Boolean,
        default: false
    },
    allowedCampaignReturnSlots: {
        type: Number,
        default: 3
    }
});

// Export the model
const User = mongoose.model("User", userSchema);

module.exports = User