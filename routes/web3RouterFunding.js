const User=require("../models/User");
const Campaign=require("../models/Campaign");
const {info,err}=require("../utils/logger");
const deployContract=require("../web3/deploy");
const {loadContractAt, getRaisedAmount, contributeIn}=require("../web3/web3funding");
const auth=require("../middleware/auth");
const {giveApproval}=require("../web3/web3Wallet");

const web3RouterFunding = require("express").Router()

web3RouterFunding.get("/:cid", async (req,res) => {

    const {address,...contractraw} = await Campaign.findById(req.params.cid)
    const contract = loadContractAt(address);
    const raisedAmount =await getRaisedAmount(contract);
    
    const dataToSend = {
        raisedAmount,
        ...contractraw
    }
    
    res.send({
        raisedAmount
    })
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
    // const testContractAddress = 'THIS IS A TEST CONTRACT ADDRESS'
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
        manager.ownedContracts.push(saved._id.toString())
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
        await giveApproval(user.walletAddress,contractFound.address,incommingData.amount,incommingData.password)
        const contract = loadContractAt(contractFound.address);
        const txHash = await contributeIn(contract, user.walletAddress, incommingData.amount, incommingData.password);
        res.json({txHash})
    }catch(error){
        err(error.message)
        res.send(error.message)
    }
})

web3RouterFunding.post('/contribute', auth, async (req,res) => {
    
    const {password, cid, amount} = req.body;
    const {address} = await Campaign.findById(cid);
    const user = await User.findById(req.user._id)
    // info(user.walletAddress, address, amount, password);
    try{
        const contract = loadContractAt(address);
        const txHash = await contributeIn(contract, user.walletAddress, amount, password);
        res.json({txHash})
    }
    catch(error){
        err(error.message)
    }
    
    
    res.send("hi there")
})


module.exports = web3RouterFunding