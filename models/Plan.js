const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    estCost: {
        type: Number
    },
    estRevenue: {
        type: Number
    },
    duration: Number,
    requirements: [
        {
            isProduct: Boolean,
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            item: String,
            estCost: Number,
            estSale: Number,
            quantity: Number,
            unit: Number,
            category: String
        }
    ],
    executing: {
        type: Boolean,
        default: false
    },
    executionStart: {
        type: Date,
    },
    executionEnd: {
        type: Date
    }
})

const Plan = mongoose.model('Plan', planSchema)
module.exports = Plan