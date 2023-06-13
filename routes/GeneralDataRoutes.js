const { Router } = require("express");
const MSP = require("../models/Msp");

const router = Router();

router.get("/msp/:crop", async (req, res) => {
    try {
        const crop = req.params.crop
        const cropData = await MSP.findOne({ Commodity: crop })
        if (!cropData) {
            res.status(400).json({ error: true, message: "Crop not found." })
            return
        }
        res.status(200).json({ error: false, data: cropData })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
})

module.exports = router