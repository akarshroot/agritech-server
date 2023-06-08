const web3 = require('./web3')
const abi = require("./contracts/ABIs.js").CoinsABI2
const { Caddress } = require("./contracts/ABIs.js")
const { info } = require("../utils/logger");


const contract = new web3.eth.Contract(abi, Caddress)

const managerAcc = process.env.BACKEND_COINBASE_WALLET_ADDRESS
// info(managerAcc)

async function getBalance(accountAddress) {
	let bal = await contract.methods.balanceOf(accountAddress).call()
	const ans = bal // we can use ether here since KCO has same decimal number as ether i.e. 18
	return ans
}

async function transferKCO(fromAddress, toAddress, amount, password) {
	const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress, password, 300)
	info(unlockedAcc)
	if (unlockedAcc) {
		const res = await contract.methods.transfer(toAddress,amount).send({
			from: fromAddress
		})
		const { transactionHash } = res
		info(transactionHash)
		return res
	}
	return false
}

async function transferFromKCO(fromAddress, toAddress, amount, password) {
	const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress, password, 300)
	info(unlockedAcc)
	showAllowance(fromAddress, toAddress, password)
	if (unlockedAcc) {
		const res = await contract.methods.transferWithPermit(fromAddress, toAddress,amount).send({
            from:managerAcc
        })
		const { transactionHash } = res
		info(transactionHash)
		return res
	}
	return false
}

async function giveApproval(fromAddress, toAddress, amount, password) {
	const unlocked = await web3.eth.personal.unlockAccount(fromAddress, password, 300)
	info(unlocked)
	if (unlocked) {
		const balanceOfS = await contract.methods.balanceOf(fromAddress).call()
		const balanceOfR = await contract.methods.balanceOf(toAddress).call()
		info("KCO to approve :",amount)
		info("KCO in BalanceS:", balanceOfS + '')
		info("KCO in BalanceR:", balanceOfR + '')
		const approvalRes = await contract.methods.approve(toAddress,amount).send({
			from: fromAddress,
		})
		info('Approval status', approvalRes)
		return approvalRes
	} else {
		return new Error('Incorrect Password or account not correct')
	}
}

async function showAllowance(fromAddress, toAddress, password) {
	const unlocked = await web3.eth.personal.unlockAccount(fromAddress, password, 300)
	info(unlocked)
	if (unlocked) {
		const approvalRes = await contract.methods.allowance(fromAddress, toAddress).call()
		info('Approval status', approvalRes)
		return approvalRes
	} else {
		return 'Incorrect Password or account not correct'
	}
}



async function addAccount(password) {
	const newPrivateKey = web3.eth.accounts.create().privateKey.substr(2)
	const res = await web3.eth.personal.importRawKey(newPrivateKey, password) //private key and password
	return res
}

module.exports = {
	getBalance,
	addAccount,
	transferKCO,
	transferFromKCO,
	giveApproval,
}