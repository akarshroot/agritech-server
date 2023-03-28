const {transferKCO} = require('./web3Wallet')

const fromAddress = '0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637'
const toAddress = '0x879005ce3b64a880e1512d759cecb1bd857590f8'
const amount = 100
const pass = "Iamjastagar1@mks"

transferKCO(fromAddress,toAddress,amount,pass)