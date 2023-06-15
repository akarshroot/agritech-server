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
    pledges: [
        {
            name: {
                type: String,
                required: true
            },
            KCOLimit: {
                type: Number,
                required: true
            },
            selectedCrops: [
                {
                    crop: {
                        type: String,
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true
                    },
                    unit: {
                        type: String,
                        required: true
                    },
                    discount: {
                        type: Number,
                        required: true,
                        min: 1,
                        max: 100
                    }
                }
            ]
        }
    ],
    description: {
        type: String,
        required: true
    },
    featuredImage: {
        type: String,
        default: "https://picsum.photos/536/354"
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