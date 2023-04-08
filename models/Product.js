const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
    soldBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    imgUrl: {
        type: String,
    },
    category: [
        {
            type: String,
            required: true,
            default: "all",
            _id: false
        }
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    description: {
        type: String,
        default: "No description added."
    },
    quantity: {
        type: String
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product