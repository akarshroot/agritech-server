const web3 = require('./web3.js')
const { FundingABI2 } = require('./contracts/ABIs.js')
const { info } = require("../utils/logger");
const {getPrivateKeyFromAccount}=require('./web3Utils/web3Utils.js');
const {createRequestMessageToSign}=require('./contracts/signartureMessages.js');

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

async function getSignR(contractAddress,toAddress,value,signer,password){
	const msgData = createRequestMessageToSign(contractAddress,toAddress,value)
  const signature1 = signTypedData({
      privateKey:getPrivateKeyFromAccount(signer,password),
      data:msgData,
      version: SignTypedDataVersion.V4,
    });
    return splitSignature(signature1)
    
}
// initiate VoteReq
async function initateVoteReq(contract, fromAddress, toAddess, amount, reason, password) {
    const Amount = amount
    const unlocked = await web3.eth.personal.unlockAccount(process.env.BACKEND_COINBASE_WALLET_ADDRESS, process.env.BACKEND_COINBASE_WALLET_PASSWORD, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const {r,s,v} = getSignR(contract._address,toAddess,amount,fromAddress,password);
        const response = await contract.methods.createRequest(reason, toAddess, Amount,v,r,s).send({
            from: process.env.BACKEND_COINBASE_WALLET_ADDRESS
        })
        info("Vote Res->", response)
        return response
    } else {
        return 'No Contract selected or password incorrect'
    }
}
// vote in certain req
async function voteInReq(contract, reqNumber, fromAddress, password) {
    const unlocked = await web3.eth.personal.unlockAccount(fromAddress, password, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const response = await contract.methods.voteRequest(reqNumber).send({
            from: fromAddress
        })
        info("Voted->", response)
        return response
    } else {
        return 'No Contract selected or password incorrect'
    }

}
// withdraw from activeRequest
async function activateRequest(contract, fromAddress, reqNumber, password) {
    const unlocked = await web3.eth.personal.unlockAccount(fromAddress, password, 1000)
    info(unlocked)
    if (contract && unlocked) {
        const response = await contract.methods.transferToBuy(parseInt(reqNumber) - 1).send({
            from: fromAddress
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