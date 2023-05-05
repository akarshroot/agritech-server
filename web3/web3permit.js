require("dotenv").config()
const fs = require('fs')
const {signTypedData,SignTypedDataVersion} = require("@metamask/eth-sig-util");
const abi = require("./contracts/ABIs.js").CoinsABI2
const {Caddress} = require("./contracts/ABIs.js")
const web3=require("./web3");
const {info}=require("../utils/logger.js");
const {permitWalletMessageToSign}=require('./contracts/signartureMessages.js');
const {loadContractAt}=require('./web3funding.js');


const contract = new web3.eth.Contract(abi,Caddress)

// const myPrivateKey = process.env.BACKEND_COINBASE_WALLET_PRIVATEKEY
// const managerAcc = process.env.BACKEND_COINBASE_WALLET_ADDRESS
const managerAcc = '0x04c3a9591730b0fb78f18a258520d8f23431f06c'

function splitSignature(signature){
    const r = signature.slice(0,66);
    const s = "0x" + signature.slice(66,130);
    const v = parseInt("0x" + signature.slice(130,132));
    console.log("r:",r)
    console.log("s:",s)
    console.log("v:",v)
    return {r,s,v}
}
async function getSign(owner,toAddress,value,password){
    const nonce = await contract.methods.nonces(owner).call()
    info(nonce);
    const msgData = permitWalletMessageToSign(owner,toAddress,nonce,value)
    const signature = signTypedData({
        privateKey:getPrivateKeyFromAccount(owner,password),
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature)
    
}
function getPrivateKeyFromAccount(account,password){
    info("Getting Users Private Key....")
    const encryptedFile = fs.readdirSync(__dirname+'/../keystore')
    info("Encrypted Files->",encryptedFile)
    const requiredPath = encryptedFile.find(e => {
        info('finding',e.split("--")[2],"for",account.slice(2))
        return e.split("--")[2]===account.slice(2).toLowerCase()
    })
    info("RequiredFilePath->",requiredPath)
    if(!requiredPath){
        console.log("account Not Found!!")
        return
    }
    const encryptedAccountFile = fs.readFileSync(__dirname+'/../keystore/'+requiredPath,'utf8')
    info('returning privateKey')
    return web3.eth.accounts.decrypt(encryptedAccountFile,password).privateKey.slice(2)
}
async function givePermit(fromAddress,toAddress, amount, password){
    info('giving permit...')
    const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress,password,1000)
	console.log(unlockedAcc)
	if(unlockedAcc){
        info('getting Signature...')
        const {r,s,v} = await getSign(fromAddress,toAddress,amount,password)
        info('Signature Got',r,s,v)
		const permit = contract.methods.permit(fromAddress,toAddress,amount,'10000000000',v,r,s).send({
            from:managerAcc
        })
        return permit
    }
}
async function contributeIn(loadedContract, contributerAddress, amount) {
    const unlocked = await web3.eth.personal.unlockAccount(managerAcc,"",1000)
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
    console.log("Final permit-->", permitTx)
    const thisContract = loadContractAt(toAddress);
    const contributionCalling = await contributeIn(thisContract,fromAddress,amount);

    console.log("Contribution Calling--->",contributionCalling)
    return contributionCalling
}
module.exports = {
    ContributeGasLessly,
    givePermit,
    getPrivateKeyFromAccount,
}