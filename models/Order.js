const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    etd: {
        type: Date,
        default: () => {
            let date = new Date()
            date.setDate(date.getDate() + 7)
            return date
        }
    },
    created: {
        type: Date,
        immutable: true,
        default: () => new Date()
    },
    address: {
        type: String,
        default: "#101, Sarita Vihar, New Delhi, India"
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order