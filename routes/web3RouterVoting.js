const auth=require('../middleware/auth')
const Campaign=require('../models/Campaign')
const Product=require('../models/Product')
const User=require('../models/User')
const Transaction=require('../models/Transaction')
const {err, info}=require('../utils/logger')
const {initateVoteReq, loadContractAt, voteInReq, activateRequest}=require('../web3/web3funding')

const web3RouterVoting = require('express').Router()

/*
    reason:reason.value,
    password:password.value,
    receiverProduct:receiverId,
    amount: amount.value? amount.value:'GetFromProduct'
*/

web3RouterVoting.post('/makeRequest',auth, async (req,res) => {
    
    const {reason,receiverProduct,amount,campaignId,password} = req.body
    const campaignData = await Campaign.findById(campaignId);
    const user = await User.findById(req.user._id);
    let dataFormed;
    let product;
    if(amount === 'GetFromProduct'){
        product = await Product.findById(receiverProduct)
        const reqAmount = product.price
        const finalreceiver= '0x5c5e8d4372c726e3643fe2bb9c6c643c9fcff6f6';
        // const ProductOwner = await User.findById(product.soldBy)    //its sold by AgriTech for now
        dataFormed = {
            reason,
            receiver:finalreceiver,
            amount:reqAmount,
            product
        }
    }else{
        dataFormed = {
            reason,
            receiver:user.walletAddress,
            amount,
            product
        }
    }
    try{
        const contract = loadContractAt(campaignData.address);
        const response = await initateVoteReq(contract,user.walletAddress,dataFormed.receiver,dataFormed.amount,dataFormed.reason,password)
        
        const voteNumberBylen = campaignData.voteRequests.length
        const voteData = {
            reason,
            amount:dataFormed.amount,
            receiver: product? product._id:user._id,
            votes:0,
            voteNumber: voteNumberBylen+1
        }
        campaignData.voteRequests.push(voteData)
        await campaignData.save()
        res.json({
            status:'Success',
            message:'Request for Withdraw Created'
        })
    }catch(error){
        err(error.message)
        res.status(400).json({
            error: true,
            status:'Failed to create req',
            message: error.message
        })
    }
})

web3RouterVoting.post('/vote',auth,async (req, res) => {
    const {voteNumber, password,cid,vote} = req.body
    const user = await User.findById(req.user._id)
    const campaignDetails = await Campaign.findById(cid)
    const contract = loadContractAt(campaignDetails.address);
    if(vote==='dontAllow'){
        campaignDetails.contributors[user._id].deniedRequests.push(voteNumber)
        await campaignDetails.save()
        res.json({
            status:"Success",
            message:"voted"
        })
        return
    }
    try{
        const response = await voteInReq(contract,voteNumber,user.walletAddress,password)
        campaignDetails.voteRequests[voteNumber-1].votes+=1
        await campaignDetails.save()
        res.json({
            status:"Success",
            message:"voted"
        })
    }catch(error){
        err(error.message)
        res.json({
            status:"Failed to vote",
            message:error.message
        })
    }
})

web3RouterVoting.post("/useRequestedMoney",auth,async (req,res) => {
    const {voteNumber, password,cid} = req.body
    const user = await User.findById(req.user._id)
    const campaignData = await Campaign.findById(cid)
    const reciverUser = await User.findById(campaignData.voteRequests[voteNumber-1].receiver)
    if(campaignData.voteRequests[voteNumber-1].votes ===0){
        res.json({
            status:"Failed to use Req",
            message:"No one has Voted yet"
        })
        return
    }
    try{
        const contract = loadContractAt(campaignData.address)
        const response = await activateRequest(contract, user.walletAddress, voteNumber,password)
        info(response)
        const tx = new Transaction({
            senderId:campaignData._id,
            receiverId:reciverUser._id,
            amount:campaignData.voteRequests[voteNumber-1].amount,
            txHash:response.transactionHash,
        })
        const savedTx = await tx.save()
        campaignData.campaignTransactions.push(savedTx._id);// also need to add this to the user
        reciverUser.transactions.push(savedTx._id);
        await campaignData.save()
        await reciverUser.save()
        res.json({
            status:"Success",
            message:"Request used, purchase successfull"
        })
    }catch(error){
        err(error.message)
        res.json({
            status:"Failed to use Req",
            message:error.message
        })
    }
})

module.exports = web3RouterVoting