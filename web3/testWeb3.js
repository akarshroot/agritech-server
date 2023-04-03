const {transferKCO, giveApproval} = require('./web3Wallet')

const fromAddress = '0x879005ce3b64a880e1512d759cecb1bd857590f8'
const toAddress = '0x1cE8c5Ccf95154C3B5A806f90392B62A1540052e'
const amount = 5000
const pass = "1234567890" // your passs here

// transferKCO(fromAddress,toAddress,amount,pass)

giveApproval(
    fromAddress,
    toAddress,
    pass,
    amount
)

// transferKCO(
// 	'0x2ee4961905e3c9b6ec890d5f919224ad6bd87637',
// 	'0x879005ce3b64a880e1512d759cecb1bd857590f8',
// 	99,
// 	'Iamjastagar1@mks'
// 	)