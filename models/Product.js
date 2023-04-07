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
        type: String,
        default: "AgriTech"
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    imgUrl: {
        type: String,
    },
    category: {
        type: String,
        required: true
    }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product