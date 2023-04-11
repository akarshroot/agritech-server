const Web3=require("web3");
const web3=require("./web3");
const {info} = require('../utils/logger')
const abi = require("./contracts/ABIs.js").CoinsABI
const {Caddress} = require('./contracts/ABIs')
const {Transaction} = require('ethereumjs-tx');

info(Transaction)

const contract = new web3.eth.Contract(abi,Caddress)

transferKCO(
    '0x2ee4961905e3c9b6ec890d5f919224ad6bd87637',
    '0xbe48d73a8244dcdaa359be58caba27e8cde0d280',
    10,
    'Iamjastagar1@mks'
)

const myPrivateKey = 'da16055875638e551f73e81e1252e40d161b3ab47758c376c055f0bc0d4cd8b0'
const managerAcc = '0x2ee4961905e3c9b6ec890d5f919224ad6bd87637'

async function transferKCO(fromAddress,toAddress, amount, password){
	const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress,password,300)
	info(unlockedAcc)
    // const signedTx = await web3.eth.accounts.signTransaction(rawTransaction,myPrivateKey)
    // info(signedTx)
	if(unlockedAcc){
		const res = contract.methods.transfer(toAddress,amount).encodeABI()
		// info(res)
        info(await web3.eth.accounts)
        const signedTx = await web3.eth.accounts.signTransaction({
            from: fromAddress,
            gasPrice: 1000000000,
            gasLimit: 21000,
            to:contract.options.address,
            data:res
        })
        info(signedTx)
	}
	return false
}

