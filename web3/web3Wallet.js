const Web3 = require('web3')
const web3 = require('./web3')
const abi = require("./contracts/ABIs.js").CoinsABI
const {Caddress} = require("./contracts/ABIs.js")

const contract = new web3.eth.Contract(abi,Caddress)

async function getBalance(accountAddress){
    let bal = await contract.methods.balanceOf(accountAddress).call()
	const ans = Web3.utils.fromWei(bal,"ether") // we can use ether here since KCO has same decimal number as ether i.e. 18
	return ans
}

async function transferKCO(fromAddress,toAddress, amount, password){

	
	const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress,password,300)
	console.log(unlockedAcc)
	if(unlockedAcc){
		const res = await contract.methods.transfer(toAddress,Web3.utils.toWei((amount+''),"ether")).send({
			from:fromAddress
		})
		const {transactionHash} = res
		console.log(transactionHash)
		return res
	}
	return false
}



async function addAccount(password){
	const newPrivateKey = web3.eth.accounts.create().privateKey.substr(2)
	const res = await web3.eth.personal.importRawKey(newPrivateKey,password) //private key and password
	return res
}


module.exports = {
	getBalance,
	addAccount,
	transferKCO
}