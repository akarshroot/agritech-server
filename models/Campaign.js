const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    title:String,
    address: String,
    target:Number,
    deadline:Number,
    minContri:Number,
    dateCreated:{
        type: Date,
        default: ()=> Date.now()
    },
    manager:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    voteRequests:[{
        reason:String,
        amount:Number,
        reciver:String,
        votes:Number,
    }],
    contributors:Number,
    campaignTransactions:[{
        to:String,
        from:String,
        amount:Number,
        txHash:String,
        approvalHash:String
    }]
})

const Campaign = mongoose.model('Campaign',contractSchema)
module.exports = Campaign