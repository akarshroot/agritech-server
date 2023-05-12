const mongoose = require('mongoose')

const OTPSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    otp: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000),
        immutable: true
    }
})
OTPSchema.index( { "createdAt": 1 }, { expireAfterSeconds: 600 } )
const OTP = mongoose.model('OTP', OTPSchema)
module.exports = OTP