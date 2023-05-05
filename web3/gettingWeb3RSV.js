const {
	createRequestMessageToSign,
	contributeMessageToSign,
	voteRequestMessageToSign,
	transferToBuyMessageToSign

}=require("./contracts/signartureMessages");
const {signTypedData,SignTypedDataVersion} = require("@metamask/eth-sig-util");
// const {getPrivateKeyFromAccount}=require("./web3permit");


// const contract = new web3.eth.Contract(abi,Caddress)

function splitSignature(signature){
    const r = signature.slice(0,66);
    const s = "0x" + signature.slice(66,130);
    const v = parseInt("0x" + signature.slice(130,132));
    console.log("v:",v)
    console.log("r:",r)
    console.log("s:",s)
    return {r,s,v}
}

async function getSign(owner,toAddress,value,password){
    const nonce = await contract.methods.nonces(owner).call()
    console.log("nonce-->",nonce)
    const msgData = voteRequestMessageToSign
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    console.log(signature1)
    return splitSignature(signature1)
    
}
async function getSignVR(contractAddress,sender,number,password){
    const msgData = voteRequestMessageToSign(contractAddress,number,sender)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}
async function getSignTR(contractAddress,sender,number,password){
    const msgData = transferToBuyMessageToSign(contractAddress,number,sender)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}

async function getSignC(contractAddress,sender,amount,password){
    const msgData = contributeMessageToSign(contractAddress,amount,sender)
    const signature1 = signTypedData({
        privateKey:getPrivateKeyFromAccount(sender,password),
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}

module.exports = {
	getSignC,
	// getSignR,
	getSignTR,
	getSignVR
}