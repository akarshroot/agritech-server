const { Router } = require("express");
const Plan = require("../models/Plan");
const User = require("../models/User");
const { err, info } = require("../utils/logger");
const auth = require('../middleware/auth');
const Inventory = require("../models/InventoryItems");

const router = Router();

router.post("/plan/create", auth, async (req, res) => {
    try {
        const data = req.body
        data.estCost = 0;
        data.estRevenue = 0;
        data.requirements.forEach(item => {
            data.estCost += item.estCost * item.quantity
            if (item.estSale)
                data.estRevenue += item.estSale * item.quantity
        });
        const plan = await Plan(data).save()
        if (plan)
            res.status(200).json({ error: false, message: "Plan created successfully." })
        else res.status(500).json({ error: true, message: "Could not create new plan. Try again later." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.get("/plan/all", auth, async (req, res) => {
    try {
        const uid = req.query.user
        const plan = await Plan.find({ createdBy: uid })
        if (plan)
            res.status(200).json({ error: false, data: plan })
        else res.status(500).json({ error: true, message: "Could not find any plans." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
});

router.delete("/plan", auth, async (req, res) => {
    try {
        const pid = req.query.id
        const checkPlanExecution = await Plan.findOne({ _id: pid })
        if (checkPlanExecution.executing) {
            res.status(400).json({ error: true, message: "Cannot delete a plan under execution." })
            return
        }
        const plan = await Plan.deleteOne({ _id: pid })
        if (plan)
            res.status(200).json({ error: false, message: "Plan deleted." })
        else res.status(500).json({ error: true, message: "Could not find any plans." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

router.post("/plan/execute", auth, async (req, res) => {
    try {
        const pid = req.body.planId
        const userId = req.body.user
        const endDate = new Date()
        const getplan = await Plan.findOne({ _id: pid })
        endDate.setMonth(endDate.getMonth() + getplan.duration)
        const plan = await Plan.findOneAndUpdate({ _id: pid }, { executing: true, executionStart: new Date(), executionEnd: endDate })
        if (plan) {
            const user = await User.findOneAndUpdate({ _id: userId }, { currentPlan: pid })
            if (user)
                res.status(200).json({ error: false, message: "Plan is under execution now." })
            else throw new Error("Couldn't update user.")
        }
        else res.status(500).json({ error: true, message: "Could not find any plans." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

router.post("/inventory/add", auth, async (req, res) => {
    try {
        const data = req.body
        const item = await Inventory(data).save()
        if (item)
            res.status(200).json({ error: false, message: "Inventory updated successfully." })
        else res.status(500).json({ error: true, message: "Could not add item. Try again later." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

router.get("/inventory/all", auth, async (req, res) => {
    try {
        const uid = req.query.user
        const inventory = await Inventory.find({ ownerId: uid })
        if (inventory) {
            let total = 0;
            inventory.forEach(i => total += i.estCost*i.quantity)
            res.status(200).json({ error: false, data: inventory, totalValue: total })
        }
        else res.status(500).json({ error: true, message: "Could not find any plans." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

router.post("/inventory/use", auth, async (req, res) => {
    try {
        const itemId = req.body.itemId
        const usedQuantity = req.body.used
        const inventory = await Inventory.findOneAndUpdate({ _id: itemId }, { $inc: { quantity: -1*usedQuantity} }, {new: true})
        if(inventory.quantity < 0 || inventory.quantity === 0) await Inventory.findOneAndDelete({_id: itemId})
        if (inventory)
            res.status(200).json({ error: false, message: "Inventory updated." })
        else res.status(500).json({ error: true, message: "Could not find any plans." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

router.delete("/inventory", auth, async (req, res) => {
    try {
        const itemId = req.query.itemId
        const item = await Inventory.deleteOne({ _id: itemId })
        if (item)
            res.status(200).json({ error: false, message: "Item deleted." })
        else res.status(500).json({ error: true, message: "Could not find any items." })
    } catch (e) {
        err(e)
        res.status(500).send()
    }
})

module.exports = router;