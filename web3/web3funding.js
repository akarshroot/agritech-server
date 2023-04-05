const Web3 = require('web3')
const web3 = require('./web3.js')
const {FundingABI}=require('./contracts/ABIs.js')
const {giveApproval}=require('./web3Wallet.js')
const {info}=require("../utils/logger");

/*

the following data needs to be stored from front end

deadline
minContributiuon
target

*/

function loadContractAt(address){
    const findcontract = new web3.eth.Contract(FundingABI,address)
    info("contract at ->>",findcontract)
    return findcontract
}

async function getRaisedAmount(contract){
    if(contract){
        const amount = await contract.methods.getRaisedAmount().call()
        return amount
    }else{
        return 'No Contract selected'
    }
}
async function contributeIn(contract, contributerAddress, amount,contributorPassword){

    const unlocked = await web3.eth.personal.unlockAccount(contributerAddress,contributorPassword,300)
    // const approvalRes = await giveApproval()
    if(contract && unlocked){
        const res = await contract.methods.contribute(amount).send({
            from:contributerAddress
        })
        info(res)
        return res

    }else{
        return 'No Contract selected or password incorrect'
    }
}

// contributeIn(
//     loadContractAt('0x98CB0298e6eA6E446454576780A8a5d9013C5fb4'),
//     103,
//     '0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637',
//     'Iamjastagar1@mks'
//     )

module.exports = {
    loadContractAt,
    getRaisedAmount,
    contributeIn,
}