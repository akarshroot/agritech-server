const {
	createRequestMessageToSign,
	contributeMessageToSign,
	voteRequestMessageToSign,
	transferToBuyMessageToSign
}=require("./contracts/signartureMessages");
const web3=require("./web3");
// const getPrivateKeyFromAccount = require("./web3permit")
const {signTypedData,SignTypedDataVersion} = require("@metamask/eth-sig-util");

const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_target",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_minContribution",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenamount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "Contribute",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "CreateRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "GetContractTokenBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_reqNumber",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "TransferToBuy",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_reqNumber",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "VoteRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allRequests",
		"outputs": [
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "numberOfVoters",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deadline",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minContribution",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "noOfContributors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "numberOfRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "target",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "verifyC",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "a",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "verifyR",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "number",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "verifyTR",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "number",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "verifyVR",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const Caddress = '0x749B6a884549Cd1504EF18B24e90076929949191'

const contract = new web3.eth.Contract(abi,Caddress)

function splitSignature(signature){
    const r = signature.slice(0,66);
    const s = "0x" + signature.slice(66,130);
    const v = parseInt("0x" + signature.slice(130,132));
    console.log("v:",v)
    console.log("r:",r)
    console.log("s:",s)
    return {r,s,v}
}

async function getSign(owner,toAddress,value,ForThisPrivateKey){
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
async function getSignVR(contractAddress,sender,number,ForThisPrivateKey){
    const msgData = voteRequestMessageToSign(contractAddress,number,sender)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}
async function getSignTR(contractAddress,sender,number,ForThisPrivateKey){
    const msgData = transferToBuyMessageToSign(contractAddress,number,sender)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}
async function getSignR(contractAddress,toAddress,value,ForThisPrivateKey){
	const msgData = createRequestMessageToSign(contractAddress,toAddress,value)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}
async function getSignC(contractAddress,sender,amount,ForThisPrivateKey){
    const msgData = contributeMessageToSign(contractAddress,amount,sender)
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    return splitSignature(signature1)
    
}
async function giveApproval(fromAddress, toAddress, amount, password) {
	const unlocked = await web3.eth.personal.unlockAccount(fromAddress, password, 300)
	console.log(unlocked)
	if (unlocked) {
		const balanceOfS = await contract.methods.balanceOf(fromAddress).call()
		const balanceOfR = await contract.methods.balanceOf(toAddress).call()
		console.log("KCO to approve :",amount)
		console.log("KCO in BalanceS:", balanceOfS + '')
		console.log("KCO in BalanceR:", balanceOfR + '')
		const approvalRes = await contract.methods.approve(toAddress,amount).send({
			from: fromAddress,
		})
		console.log('Approval status', approvalRes)
		return approvalRes
	} else {
		return new Error('Incorrect Password or account not correct')
	}
}
// getSignVR(
// 	'0x8DCDdF04874c28Ff96a013326f2713aA7359bbA1', // contract address
// 	0,
// 	'0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637', // who to recieve
// 	'da16055875638e551f73e81e1252e40d161b3ab47758c376c055f0bc0d4cd8b0' //
// )
getSignTR(
	Caddress, // contract address
	'0x879005CE3b64A880E1512D759CEcb1bd857590F8', // who to recieve
	100,
	'da16055875638e551f73e81e1252e40d161b3ab47758c376c055f0bc0d4cd8b0' //privateKey that will be used to sign a message, since this has to be owner's/Manager's Key
)


// getSignC(
// 	'0x9acfd3971cF46C571AF304219645e431Df05c888', // contract address
// 	100, // value to contri
// 	'0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637', // who to recieve
// 	// 'to Buy Seeds', // reasson
// 	'da16055875638e551f73e81e1252e40d161b3ab47758c376c055f0bc0d4cd8b0' //
// )













// giveApproval(
// 	'0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637',
// 	'0x86Ad02359B54AF202D79C7fB3a038e40E18B6758',
// 	100,
// 	'Iamjastagar1@mks'
// )
