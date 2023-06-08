const {
	createRequestMessageToSign,
	// contributeMessageToSign,
	voteRequestMessageToSign,
	transferToBuyMessageToSign,
  permitWalletMessageToSign
}=require("./contracts/signartureMessages");
const {signTypedData,SignTypedDataVersion} = require("@metamask/eth-sig-util");
const {getPrivateKeyFromAccount}=require("./web3Utils/web3Utils.js");
const web3=require("./web3");
const {CoinsABI2,Caddress} = require("./contracts/ABIs.js")

function splitSignature(signature){
    const r = signature.slice(0,66);
    const s = "0x" + signature.slice(66,130);
    const v = parseInt("0x" + signature.slice(130,132));
    console.log("v:",v)
    console.log("r:",r)
    console.log("s:",s)
    return {r,s,v}
}
const contract = new web3.eth.Contract(CoinsABI2,Caddress)

async function getSign(owner,toAddress,value,password){
  const nonce = await contract.methods.nonces(owner).call()
  const msgData = permitWalletMessageToSign(owner,toAddress,nonce,value)
  const signature = signTypedData({
      privateKey:getPrivateKeyFromAccount(owner,password),
      data:msgData,
      version: SignTypedDataVersion.V4,
    });
  return splitSignature(signature) 
}
// Signature for voting in a contract
async function getSignVR(contractAddress,number,voter,password){
    const msgData = voteRequestMessageToSign(contractAddress,number)
    const signature = signTypedData({
        privateKey:getPrivateKeyFromAccount(voter,password),
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature)
    
}
async function getSignTR(contractAddress,number,owner,password){
    const msgData = transferToBuyMessageToSign(contractAddress,number)
    const signature = signTypedData({
        privateKey:getPrivateKeyFromAccount(owner,password),
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature)
    
}
async function getSignR(contractAddress,toAddress,value,signer,password){
	const msgData = createRequestMessageToSign(contractAddress,toAddress,value)
  const signature = signTypedData({
      privateKey:getPrivateKeyFromAccount(signer,password),
      data:msgData,
      version: SignTypedDataVersion.V4,
    });
    return splitSignature(signature)
    
}
// async function getSignC(contractAddress,sender,amount,password){
//     const msgData = contributeMessageToSign(contractAddress,amount,sender)
//     const signature = signTypedData({
//         privateKey:getPrivateKeyFromAccount(sender,password),
//         data:msgData,
//         version: SignTypedDataVersion.V4,
//       });
//     return splitSignature(signature)
    
// }

module.exports = {
	// getSignC,
	getSignR,
	getSignTR,
	getSignVR,
  getSign,
  splitSignature
}