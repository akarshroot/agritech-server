const {info}=require('../utils/logger')
const {FundingABI}=require('./contracts/ABIs')
const web3=require('./web3')
const {transferKCO, giveApproval} = require('./web3Wallet')

const fromAddress = '0x879005ce3b64a880e1512d759cecb1bd857590f8'
const toAddress = '0xEa290a8F4fFdf0ca97ccf721c16812F71f8Deffb'
const amount = 5000
const pass = "1234567890" // your passs here


const contract = new web3.eth.Contract(FundingABI,'0x8C5456399494739738e97688Dcf15184b6585e16')
web3.eth.personal.unlockAccount(fromAddress,pass,300).then(()=>{
    contract.methods.contribute(100).send({
        from:fromAddress
    }).then((res) => {
        info(res)
    })
})