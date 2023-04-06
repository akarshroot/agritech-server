const User=require("../models/User");
const Campaign=require("../models/Campaign");
const {info,err}=require("../utils/logger");
const deployContract=require("../web3/deploy");
const {loadContractAt, getRaisedAmount, contributeIn}=require("../web3/web3funding");
const auth=require("../middleware/auth");
const {giveApproval}=require("../web3/web3Wallet");

const web3RouterFunding = require("express").Router()

web3RouterFunding.get("/:cid", async (req,res) => {

    const contractraw = await Campaign.findById(req.params.cid).populate('manager')
    const contract = loadContractAt(contractraw.address);
    const raisedAmount =await getRaisedAmount(contract);
    
    const dataToSend = {
        raisedAmount,
        ...contractraw._doc
    }
    
    res.json(dataToSend)
})

web3RouterFunding.get("/raised/:cid",async (req,res) => {

    const {address} = await Campaign.findById(req.params.cid)
    const contract = loadContractAt(address);
    const raisedAmount =await getRaisedAmount(contract);
    
    res.json({
        raisedAmount
    })
})

web3RouterFunding.get('/', auth, async (req,res) => {
    try{
        const allContracts = await Campaign.find({})
        res.json(allContracts)
    }catch(err){
        err(err)
    }
})

web3RouterFunding.post('/deployContract',async (req,res) => {
    try{
        const data = req.body
        info(data)
        const manager = await User.findById(data.userId)
        info(manager)
        const contract = await deployContract(
            data.walletAddress,
            data.password,
            data.target,
            data.deadline,
            data.minContribution,
        )
        const newContractModel = new Campaign({
            title:data.title,
            address:contract._address,
            target: data.target,
            deadline: data.deadline,
            minContri: data.minContribution,
            date: new Date(),
            manager: manager._id
        })
        const saved = await newContractModel.save()
        info(saved)
        manager.ownedContracts.push(saved._id)
        await manager.save()
        // info(address._address)
        res.json({
            status:"Deployed Successfully",
            // address:address._address
        })
    }catch(error){
        err(error)
        res.send(error)
    }

})

web3RouterFunding.post('/getApproval', auth, async (req,res) => {
    const incommingData = req.body;
    const user = await User.findById(req.user._id);
    const contractFound = await Campaign.findById(incommingData.cid)
    // info(user.walletAddress,contract.address,incommingData.amount,incommingData.password)
    try{
        const approval = await giveApproval(user.walletAddress,contractFound.address,incommingData.amount,incommingData.password)
        const approvalHash = approval.transactionHash
        const contract = loadContractAt(contractFound.address);
        const txHash = await contributeIn(contract, user.walletAddress, incommingData.amount, incommingData.password);
        info("TransActionHash Needed--->>>",txHash.transactionHash)
        contractFound.campaignTransactions.push({
            to:contractFound.address,
            from:user.walletAddress,
            amount:incommingData.amount,
            txHash:txHash.transactionHash,
            approvalHash
        })
        user.transactions.push({
            to:contractFound.address,
            from:user.walletAddress,
            amount:incommingData.amount,
            txHash:txHash.transactionHash
        })
        await user.save()
        await contractFound.save()
        res.json({txHash})
    }catch(error){
        err(error.message)
        res.send(error.message)
    }
})


module.exports = web3RouterFunding