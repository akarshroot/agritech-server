const User = require("../models/User");
const Campaign = require("../models/Campaign");
const ContributionTx=require("../models/ContributionTx");
const { info, err } = require("../utils/logger");
const deployContract = require("../web3/deploy");
const { loadContractAt, getRaisedAmount } = require("../web3/web3funding");
const auth = require("../middleware/auth");
const {ContributeGasLessly}=require("../web3/web3permit");
const {schduleRefundCall}=require("../web3/web3Utils/web3ExpiryHandling");

const web3RouterFunding = require("express").Router()

web3RouterFunding.get("/:cid", async (req, res) => {
    try {
        const contractraw = await Campaign.findById(req.params.cid).populate(['manager','campaignTransactions'])
        const contract = loadContractAt(contractraw.address);
        const raisedAmount = await getRaisedAmount(contract);

        const dataToSend = {
            raisedAmount,
            ...contractraw._doc
        }
        res.status(200).json(dataToSend)
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
})

web3RouterFunding.get("/raised/:cid", async (req, res) => {
    try {
        const { address } = await Campaign.findById(req.params.cid)
        const contract = loadContractAt(address);
        const raisedAmount = await getRaisedAmount(contract);

        res.status(200).json({
            raisedAmount
        })
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: error.message })
    }
})

web3RouterFunding.get('/', auth, async (req, res) => {
    try {
        const allContracts = await Campaign.find({})
        res.status(200).json(allContracts)
    } catch (err) {
        err(err)
        res.status(500).json({ error: true, message: err.message })
    }
})

web3RouterFunding.post('/deployContract',async (req,res) => {
    try{
        const data = req.body
        const manager = await User.findById(data.userId)
        const expire = data.deadline
        const contract = await deployContract(
            data.walletAddress,
            data.password,
            data.target,
            expire,
            data.minContribution,
        )
        const newContractModel = new Campaign({
            title: data.title,
            address: contract._address,
            target: data.target,
            deadline: expire,
            minContri: data.minContribution,
            date: new Date(),
            manager: manager._id
        })
        const saved = await newContractModel.save()
        info("Expire-->",expire)
        // info("Expire-->",Math.floor(+new Date() / 1000))
        schduleRefundCall(expire,contract._address)
        res.status(200).json({
            status: "Deployed Successfully",
        })
    } catch (error) {
        err(error)
        res.status(500).json({ error: true, message: error.message })
    }

})

web3RouterFunding.post('/getApproval', auth, async (req,res) => {
    const incommingData = req.body;
    const user = await User.findById(req.user._id);
    const contractFound = await Campaign.findById(incommingData.cid)
    try{
        const txHash =await ContributeGasLessly(user.walletAddress,contractFound.address,incommingData.amount,incommingData.password)
        const tx = new ContributionTx({
            senderId: user._id,
            receiverId: contractFound._id,
            amount:incommingData.amount,
            txHash:txHash.transactionHash
        })
        await tx.save()
        const existingUser = contractFound.contributors.find(e => e.userId.toString()===user._id.toString())
        if(!existingUser){
            const newContributor = {
                userId:user._id,
                deniedRequests:[]
            }
            contractFound.contributors.push(newContributor)
            await contractFound.save()
        }
        user.contributions.push(tx._id)
        await user.save()
        res.json({
            status:"Success",
            message:"Contibuted successfully"
        })
    }catch(error){
        err(error.message)
        res.json({ 
            status:'Failed To Contribute',
            error: true,
            message: error.message })
    }
}) // API for contribution in a contract

module.exports = web3RouterFunding