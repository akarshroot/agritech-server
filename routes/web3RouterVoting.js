const auth=require('../middleware/auth')
const Campaign=require('../models/Campaign')
const Product=require('../models/Product')
const User=require('../models/User')
const {err, info}=require('../utils/logger')
const {initateVoteReq, loadContractAt, voteInReq, activateRequest}=require('../web3/web3funding')

const web3RouterVoting = require('express').Router()

/*
    reason:reason.value,
    password:password.value,
    reciverProduct:reciverId,
    amount: amount.value? amount.value:'GetFromProduct'
*/

web3RouterVoting.post('/makeRequest',auth, async (req,res) => {
    
    const {reason,reciverProduct,amount,campaignId,password} = req.body
    const campaignData = await Campaign.findById(campaignId);
    const user = await User.findById(req.user._id);
    let dataFormed;
    if(amount === 'GetFromProduct'){
        const product = await Product.findById(reciverProduct)
        const reqAmount = product.price
        let finalReciver;
        const ProductOwner = await User.findById(product.soldBy)
        finalReciver = ProductOwner.walletAddress
        dataFormed = {
            reason,
            reciver:finalReciver,
            amount:reqAmount
        }
    }else{
        dataFormed = {
            reason,
            reciver:user.walletAddress,
            amount,
        }
    }
    try{
        const contract = loadContractAt(campaignData.address);
        info(dataFormed.reciver)
        const response = await initateVoteReq(contract,user.walletAddress,dataFormed.reciver,dataFormed.amount,dataFormed.reason,password)
        const voteNumberBylen = campaignData.voteRequests.length
        const voteData = {
            reason,
            amount:dataFormed.amount,
            reciver:dataFormed.reciver,
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
        res.json({
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
    info(req.body)
    if(vote!=='allow'){
        // code to already voted
        res.json({
            status:"Success",
            message:"voted"
        })
        return
    }
    try{
        const response = await voteInReq(contract,voteNumber,user.walletAddress,password)
        info(response)
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
    info(req.body)
    const {voteNumber, password,cid} = req.body
    const user = await User.findById(req.user._id)
    const campaignData = await Campaign.findById(cid)
    try{
        const contract = loadContractAt(campaignData.address)
        const response = await activateRequest(contract, user.walletAddress, voteNumber,password)
        info(response)
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
// web3RouterVoting.post('/makeRequest',auth, async (req,res) => {
    
//     res.send('make request')
// })

module.exports = web3RouterVoting