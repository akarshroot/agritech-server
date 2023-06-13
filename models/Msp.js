const mongoose = require('mongoose');
const mspSchema = new mongoose.Schema({
    Commodity: String,
    Variety: String,
    data: [
        {
            year: Number,
            msp: Number,
            _id: false
        }
    ]
});

const MSP = mongoose.model("msp", mspSchema);

module.exports = MSP;