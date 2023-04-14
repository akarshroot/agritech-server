const fs = require('fs')
const {signTypedData,SignTypedDataVersion} = require("@metamask/eth-sig-util");
const abi = require("./contracts/ABIs.js").CoinsABI2
const {Caddress} = require("./contracts/ABIs.js")
const web3=require("./web3");
const {info}=require("../utils/logger.js");
require("dotenv").config()

info(fs)

const contract = new web3.eth.Contract(abi,Caddress)

const myPrivateKey = process.env.BACKEND_COINBASE_WALLET_PRIVATEKEY
const managerAcc = process.env.BACKEND_COINBASE_WALLET_ADDRESS

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
    const msgData = {
        types: {
          EIP712Domain: [
            {name: "name","type": "string"},
            {name: "version","type": "string"},
            {name: "chainId","type": "uint256"},
            {name: "verifyingContract","type": "address"}
          ],
          Permit: [
            {name: "owner",type: "address"},
            {name: "spender",type: "address"},
            {name: "value",type: "uint256"},
            {name: "nonce",type: "uint256"},
            {name: "deadline",type: "uint256"}
          ],
        },
        primaryType: "Permit",
        domain: {
          name: "KissanCoins",
          version: "1",
          chainId: "1337",
          verifyingContract: Caddress
        },
        message: {
          owner,
          spender: toAddress,
          value,
          nonce,
          deadline: '10000000000'
        }
    }
    // const signature =await web3.eth.personal.sign(msgData,owner,'1234567890')
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
    const requiredPath = encryptedFile.find(e => {
        return e.split("--")[2]===account.slice(2)
    })
    if(!requiredPath){
        console.log("account Not Found!!")
        return
    }
    const encryptedAccountFile = fs.readFileSync(__dirname+'/../keystore/'+requiredPath,'utf8')
    return web3.eth.accounts.decrypt(encryptedAccountFile,password).privateKey.slice(2)
}

async function givePermit(fromAddress, amount, password){
    const unlockedAcc = await web3.eth.personal.unlockAccount(fromAddress,password,1000)
	console.log(unlockedAcc)
	if(unlockedAcc){
        info('getting Signature...')
        const {r,s,v} = await getSign(fromAddress,Caddress,amount,password)
        info('Signature Got',r,s,v)

        // relayer part
		const permit = contract.methods.permit(fromAddress,Caddress,amount,'10000000000',v,r,s)
        const estimatedGas = await permit.estimateGas()
        const encodedPermit = permit.encodeABI()
        const tx = {
            from:managerAcc,
            to:Caddress,
            data:encodedPermit,
            gas: estimatedGas
        }
        const signedTx = await web3.eth.accounts.signTransaction(tx,myPrivateKey)
        const respTx =await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        return respTx
    }
}



module.exports = givePermit

/*

async function transferKCO(fromAddress,toAddress, amount, password){
	
        const res = await contract.methods.transferWithPermit(fromAddress,toAddress,amount).send({
            from:managerAcc
        })
        console.log("Transfering-->",res)
	}
	return false
}


"types": {
    "EIP712Domain": [
    {"name": "name","type": "string"},
    {"name": "version","type": "string"},
    {"name": "chainId","type": "uint256"},
    {"name": "verifyingContract","type": "address"}
    ],
    "Permit": [
    {"name": "owner","type": "address"},
    {"name": "spender","type": "address"},
    {"name": "value","type": "uint256"},
    {"name": "nonce","type": "uint256"},
    {"name": "deadline","type": "uint256"}
    ],
},
"primaryType": "Permit",
"domain": {
    "name": "KissanCoins",
    "version": "1",
    "chainId": "1",
    "verifyingContract": "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B"
},
"message": {
    "owner":"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "spender":"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "value":"1000",
    "nonce":"0x00",
    "deadline": "10000000000"
}

*/