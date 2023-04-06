const Web3 = require('web3')
const web3 = require('./web3.js')
const {FundingABI}=require('./contracts/ABIs.js')
const {info}=require("../utils/logger");

function loadContractAt(address){
    const findcontract = new web3.eth.Contract(FundingABI,address)
    return findcontract
}

async function getRaisedAmount(contract){
    if(contract){
        const amount = await contract.methods.GetContractTokenBalance().call()
        return Web3.utils.fromWei(amount,"ether")
    }else{
        return 'No Contract selected'
    }
}
async function contributeIn(contract, contributerAddress, amount,contributorPassword){

    const unlocked = await web3.eth.personal.unlockAccount(contributerAddress,contributorPassword,1000)
    // const approvalRes = await giveApproval()
    info(unlocked)
    if(contract && unlocked){
        const res = await contract.methods.contribute(Web3.utils.toWei((amount+''),"ether")).send({
            from:contributerAddress
        })
        return res

    }else{
        return 'No Contract selected or password incorrect'
    }
}


// initiate VoteReq
async function initateVoteReq(contract,fromAddress,toAddess,amount,password){
    const Amount = Web3.utils.toWei((amount+''),'ether')
    const unlocked = await web3.eth.personal.unlockAccount(fromAddress,password,1000)
    info(unlocked)
    if(contract && unlocked){
        const response = await contract.methods.createRequest(reason,toAddess,Amount).send({
            from:fromAddress
        })
        info("Vote Res->", response)
        return response
    }else{
        return 'No Contract selected or password incorrect'
    }
}
// vote in certain req
async function voteInReq(contract,reqNumber,fromAddress,password){
    const unlocked = await web3.eth.personal.unlockAccount(fromAddress,password,1000)
    info(unlocked)
    if(contract && unlocked){
        const response = await contract.methods.voteRequest(reqNumber).send({
            from:fromAddress
        })
        info("Voted->", response)
        return response
    }else{
        return 'No Contract selected or password incorrect'
    }
    
}
// withdraw from activeRequest
async function activeRequest(contract,fromAddress,reqNumber,password){
    const unlocked = await web3.eth.personal.unlockAccount(fromAddress,password,1000)
    info(unlocked)
    if(contract && unlocked){
        const response = await contract.methods.transferToBuy(reqNumber).send({
            from:fromAddress
        })
        info("Status->",response)
        return response
    }else{
        return 'No Contract selected or password incorrect'
    }
}

module.exports = {
    loadContractAt,
    getRaisedAmount,
    contributeIn,
    initateVoteReq,
    voteInReq,
    activeRequest,
}