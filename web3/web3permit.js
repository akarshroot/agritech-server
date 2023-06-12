const abi = require("./contracts/ABIs.js").CoinsABI2
const {Caddress} = require("./contracts/ABIs.js")
const web3=require("./web3");
const {info}=require("../utils/logger.js");
const {loadContractAt}=require('./web3funding.js');
const {getSign}=require("./gettingWeb3RSV.js");
const {transferFromKCO}=require("./web3Wallet.js");


const contract = new web3.eth.Contract(abi,Caddress)
const managerAcc = process.env.BACKEND_COINBASE_WALLET_ADDRESS

async function givePermit(fromAddress,toAddress, amount, password){
    info("sd",fromAddress)
    info("ad",managerAcc)
    info("ps",process.env.BACKEND_COINBASE_WALLET_PASSWORD)
    const unlockedAcc = await web3.eth.personal.unlockAccount(managerAcc,process.env.BACKEND_COINBASE_WALLET_PASSWORD,1000)
    // const deadlineForConfirmingPermit = "1000000"
    info(unlockedAcc)
	if(unlockedAcc){
        const {r,s,v} = await getSign(fromAddress,toAddress,amount,password)
        info("Got RSV")
		const permit = contract.methods.permit(fromAddress,toAddress,amount,'10000000000',v,r,s).send({
            from:managerAcc
        })
        return permit
    }
}
async function contributeIn(loadedContract, contributerAddress, amount) {
    const unlocked = await web3.eth.personal.unlockAccount(managerAcc,process.env.BACKEND_COINBASE_WALLET_PASSWORD,1000)
    info(unlocked)
    if (contract && unlocked) {
        const res = await loadedContract.methods.Contribute(amount,contributerAddress).send({
            from: managerAcc
        })
        return res
        
    } else {
        return 'No Contract selected or password incorrect'
    }
}
async function ContributeGasLessly(fromAddress,toAddress,amount,password){
    const permitTx = await givePermit(fromAddress,toAddress,amount,password);
    info("Final permit-->", permitTx)
    const thisContract = loadContractAt(toAddress);
    const contributionCalling = await contributeIn(thisContract,fromAddress,amount);

    info("Contribution Calling--->",contributionCalling)
    return contributionCalling
}

async function TransferGaslessLy(fromAddress,toAddress,amount,password){
    const permitTx = await givePermit(fromAddress,toAddress,amount,password);
    info("Final permit-->", permitTx)
    const transactionCalling = await transferFromKCO(fromAddress,toAddress,amount,password);
    info("Transaction Calling--->",transactionCalling)
    return transactionCalling
}
module.exports = {
    ContributeGasLessly,
    givePermit,
    TransferGaslessLy,
}