const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
    title:String,
    address: String,
    target:Number,
    deadline:Number,
    minContri:Number,
    associatedPlan:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Plan'
    },
    description: {
        content: String,
        unusedFundsRefund: {
            type: Boolean,
            default: true
        }
    },
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
        receiver:String,
        votes:Number,
        voteNumber:Number
    }],
    contributors:[
        {
            userId:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'User'
            },
            deniedRequests:[Number]
        }
    ],
    campaignTransactions:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"Transaction"
    }]
})

const Campaign = mongoose.model('Campaign',contractSchema)
module.exports = Campaign