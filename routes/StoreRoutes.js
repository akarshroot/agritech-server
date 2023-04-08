const { Router } = require("express");
const Product = require("../models/Product");
const { err } = require("../utils/logger");

const router = Router();

// get new access token
router.get("/products/all", async (req, res) => {
    try {
        const skip =
            req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0

        const products = await Product.find({}, undefined, { skip: skip, limit: 5 })

        res.status(200).json({ error: false, data: products })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.get("/products/:id", async (req, res) => {
    try {
        const prodId = req.params.id

        const product = await Product.findOne({_id: prodId})

        res.status(200).json({ error: false, data: product })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});
module.exports = router;