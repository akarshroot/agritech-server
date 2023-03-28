const {FundingABI}=require('./contracts/ABIs.js')
const web3 = require('./web3.js')

var contract = null

function loadContractAt(address){
    const findcontract = new web3.eth.Contract(FundingABI,address)
    console.log("contract at ->>",findcontract)
    contract = findcontract
    return findcontract
}

async function getRaisedAmount(){
    if(contract){
        const amount = await contract.methods.getRaisedAmount().call()
        console.log(amount)
        return amount
    }else{
        return 'No Contract selected'
    }
}

loadContractAt('0x8C351CCF41aF45a55afD1644D457e0383f1b4628')
getRaisedAmount()


module.exports = {
    loadContractAt,

}