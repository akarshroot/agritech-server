const { Router } = require("express");
const Product = require("../models/Product");
const { err } = require("../utils/logger");

const router = Router();

// get new access token
router.get("/products/all", async (req, res) => {
    try {
        const skip =
            req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0
        
        const category = req.query.category ? req.query.category : "all"
        const products = await Product.find({ category : category}, undefined, { skip: skip, limit: 5 })

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

router.get("/category/", async (req, res) => {
    try {
        res.status(200).json({ error: false, data: ["All", "Seed", "Infrastructure", "Service", "Insecticide", "Pesticide", "Fungicide", "Herbicide", "Growth Promoters"] })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

module.exports = router;