const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId
    },
    item: {
        type: String
    },
    quantity: {
        type: Number
    },
    category: {
        type: String
    },
    estCost: {
        type: Number
    }
})

const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = Inventory