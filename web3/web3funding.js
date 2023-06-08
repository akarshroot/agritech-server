const web3 = require('./web3.js')
const { FundingABI2 } = require('./contracts/ABIs.js')
const { info } = require("../utils/logger");
const {getSignR, getSignVR, getSignTR}=require('./gettingWeb3RSV.js');

function loadContractAt(address) {
    const findcontract = new web3.eth.Contract(FundingABI2, address)
    return findcontract
}

async function getRaisedAmount(contract) {
    if (contract) {
        const amount = await contract.methods.GetContractTokenBalance().call()
        return amount
    } else {
        return 'No Contract selected'
    }
}
// initiate VoteReq
async function initateVoteReq(cAddress, fromAddress, toAddess, amount, reason, password) {
    const contract = loadContractAt(cAddress)
    const unlocked = await web3.eth.personal.unlockAccount(process.env.BACKEND_COINBASE_WALLET_ADDRESS, process.env.BACKEND_COINBASE_WALLET_PASSWORD, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const {r,s,v} = await getSignR(cAddress,toAddess,amount,fromAddress,password);
        info("Got RSV")
        const response = await contract.methods.CreateRequest(toAddess, amount,v,r,s).send({
            from: process.env.BACKEND_COINBASE_WALLET_ADDRESS
        })
        info("Vote Res->", response)
        return response
    } else {
        return 'No Contract selected or password incorrect'
    }
}
// vote in certain req
async function voteInReq(cAddress, reqNumber, voter, password) {
    const contract = loadContractAt(cAddress);
    const unlocked = await web3.eth.personal.unlockAccount(process.env.BACKEND_COINBASE_WALLET_ADDRESS,process.env.BACKEND_COINBASE_WALLET_PASSWORD, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const {r,s,v} = await getSignVR(cAddress,reqNumber,voter,password);//contractAddress,vote number,voter,password
        const response = await contract.methods.VoteRequest(reqNumber,v,r,s).send({
            from: process.env.BACKEND_COINBASE_WALLET_ADDRESS
        })
        info("Voted->", response)
        return response
    } else {
        return 'No Contract selected or password incorrect'
    }

}
// withdraw from activeRequest
async function activateRequest(cAddress, owner, reqNumber, password) {
    const contract = loadContractAt(cAddress)
    const unlocked = await web3.eth.personal.unlockAccount(process.env.BACKEND_COINBASE_WALLET_ADDRESS,process.env.BACKEND_COINBASE_WALLET_PASSWORD, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const {r,s,v} = await getSignTR(cAddress,parseInt(reqNumber) - 1,owner,password)
        const response = await contract.methods.TransferToBuy(parseInt(reqNumber) - 1,v,r,s).send({
            from: process.env.BACKEND_COINBASE_WALLET_ADDRESS
        })
        info("Status->", response)
        return response
    } else {
        return 'No Contract selected or password incorrect'
    }
}

module.exports = {
    loadContractAt,
    getRaisedAmount,
    initateVoteReq,
    voteInReq,
    activateRequest,
}