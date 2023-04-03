const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    title:String,
    address: String,
    target:Number,
    deadline:Number,
    minContri:Number,
    dateCreated:Date,
    // manager:{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'user'
    // }
})

const ContractModal = mongoose.model('ContractMod',contractSchema)
module.exports = ContractModal