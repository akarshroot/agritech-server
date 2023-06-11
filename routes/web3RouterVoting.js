const auth=require('../middleware/auth')
const Campaign=require('../models/Campaign')
const Product=require('../models/Product')
const User=require('../models/User')
const Transaction=require('../models/Transaction')
const {err, info}=require('../utils/logger')
const {initateVoteReq, voteInReq, activateRequest}=require('../web3/web3funding')

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
    info("-->" ,campaignData)
    const user = await User.findById(req.user._id);
    let dataFormed;
    let product;
    if(amount === 'GetFromProduct'){
        product = await Product.findById(receiverProduct)
        const reqAmount = product.price
        const finalreceiver= '0x5c5e8d4372c726e3643fe2bb9c6c643c9fcff6f6';
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
        await initateVoteReq(campaignData.address,user.walletAddress,dataFormed.receiver,dataFormed.amount,dataFormed.reason,password)
        info("initated a Vote Request")
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
        info('sending Success')
        res.status(200).json({
            error:false,
            status:'Success',
            message:'Request for Withdraw Created'
        })
    }catch(error){
        err(error)
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
    
    if(vote==='dontAllow'){
        campaignDetails.contributors[user._id].deniedRequests.push(voteNumber)
        await campaignDetails.save()
        res.json({
            error: false,
            status:"Success",
            message:"voted"
        })
        return
    }
    try{
        await voteInReq(campaignDetails.address,voteNumber,user.walletAddress,password)
        campaignDetails.voteRequests[voteNumber-1].votes+=1
        await campaignDetails.save()
        res.json({
            error: false,
            status:"Success",
            message:"voted"
        })
    }catch(error){
        err(error.message)
        res.json({
            error: true,
            status:"Failed to vote",
            message:error.message
        })
    }
})

web3RouterVoting.post("/useRequestedMoney",auth,async (req,res) => {
    const {voteNumber, password,cid} = req.body
    const user = await User.findById(req.user._id)
    const campaignData = await Campaign.findById(cid)
    info('ReceiverUser->',campaignData.voteRequests[voteNumber-1].receiver)
    const voteNumberReciever = campaignData.voteRequests[voteNumber-1].receiver
    let receiverDest = await Product.findById(voteNumberReciever)
    let isProduct = true;
    if(!receiverDest._id){
        receiverDest = await User.findById(voteNumberReciever)
        isProduct = false;
    }
    if(campaignData.voteRequests[voteNumber-1].votes ===0){
        res.json({
            error: true,
            status:"Failed to use Req",
            message:"No one has Voted yet"
        })
        return
    }
    try{
        const response = await activateRequest(campaignData.address, user.walletAddress, voteNumber,password)
        info(response)
        const tx = new Transaction({
            senderId:campaignData._id,
            receiverId:receiverDest._id,
            amount:campaignData.voteRequests[voteNumber-1].amount,
            txHash:response.transactionHash,
        })
        const savedTx = await tx.save()
        campaignData.campaignTransactions.push(savedTx._id);// also need to add this to the user
        !isProduct && receiverDest.transactions.push(savedTx._id);
        await campaignData.save()
        await receiverDest.save()
        res.json({
            error: false,
            status:"Success",
            message:"Request used, purchase successfull"
        })
    }catch(error){
        err(error)
        res.json({
            error: true,
            status:"Failed to use Req",
            message:error.message
        })
    }
})

module.exports = web3RouterVoting