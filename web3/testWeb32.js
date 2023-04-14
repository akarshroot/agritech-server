const web3=require("./web3");
const getPrivateKeyFromAccount = require("./web3permit")
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
		"inputs": [],
		"name": "GetAllowance",
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
		"inputs": [],
		"name": "GetUserTokenBalance",
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
		"inputs": [
			{
				"components": [
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
				"internalType": "struct kissanFundContract2.ReqData",
				"name": "dataIncomming",
				"type": "tuple"
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
		"name": "createRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"name": "_reqNumber",
				"type": "uint256"
			}
		],
		"name": "transferToBuy",
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
				"components": [
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
				"internalType": "struct kissanFundContract2.ReqData",
				"name": "reqdata",
				"type": "tuple"
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
				"name": "_reqNumber",
				"type": "uint256"
			}
		],
		"name": "voteRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
const Caddress = '0x68692d4dBf569978EFAeEe46Dc8ffA148382076f'

const contract = new web3.eth.Contract(abi,Caddress)

function splitSignature(signature){
    const r = signature.slice(0,66);
    const s = "0x" + signature.slice(66,130);
    const v = parseInt("0x" + signature.slice(130,132));
    console.log("r:",r)
    console.log("s:",s)
    console.log("v:",v)
    return {r,s,v}
}

async function getSign(owner,toAddress,value,ForThisPrivateKey){
    const nonce = await contract.methods.nonces(owner).call()
    console.log("nonce-->",nonce)
    const msgData = {
        types: {
          EIP712Domain: [
            {name: "name",type: "string"},
            {name: "version",type: "string"},
            {name: "chainId",type: "uint256"},
            {name: "verifyingContract",type: "address"}
          ],
          Permit: [
            {name: "owner",type: "address"},
            {name: "spender",type: "address"},
            {name: "value",type: "uint256"},
            {name: "deadline",type: "uint256"}
          ],
        },
        primaryType: "Permit",
        domain: {
          name: "KissanCoins",
          version: "1",
          chainId: 1337,
          verifyingContract: Caddress
        },
        message: {
          owner,
          spender: toAddress,
          value,
          deadline: '10000000000'
        }
    }
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    console.log(signature1)
    return splitSignature(signature1)
    
}
async function getSignR(owner,toAddress,value,ForThisPrivateKey){
    const nonce = await contract.methods.nonces(owner).call()
    console.log("nonce-->",nonce)
    const msgData = {
        types: {
          EIP712Domain: [
            {name: "name",type: "string"},
            {name: "version",type: "string"},
            {name: "chainId",type: "uint256"},
            {name: "verifyingContract",type: "address"}
          ],
          Permit: [
            {name: "owner",type: "address"},
            {name: "spender",type: "address"},
            {name: "value",type: "uint256"},
            {name: "deadline",type: "uint256"}
          ],
        },
        primaryType: "Permit",
        domain: {
          name: "KissanCoins",
          version: "1",
          chainId: 1337,
          verifyingContract: Caddress
        },
        message: {
          owner,
          spender: toAddress,
          value,
          deadline: '10000000000'
        }
    }
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    console.log(signature1)
    return splitSignature(signature1)
    
}
async function getSignC(amount,sender,ForThisPrivateKey){
    const msgData = {
        types: {
          EIP712Domain: [
            {name: "name",type: "string"},
            {name: "version",type: "string"},
            {name: "chainId",type: "uint256"},
            {name: "verifyingContract",type: "address"}
          ],
          Contribute: [
            {name: "amount",type: "uint256"},
            {name: "sender",type: "address"}
          ],
        },
        primaryType: "Contribute",
        domain: {
          name: "KissanCoins",
          version: "1",
          chainId: 1337,
          verifyingContract: Caddress
        },
        message: {
          amount,
          sender
        }
    }
    const signature1 = signTypedData({
        privateKey:ForThisPrivateKey,
        data:msgData,
        version: SignTypedDataVersion.V4,
      });
    console.log(signature1)
    return splitSignature(signature1)
    
}

getSignC(
    100,
    '0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637',
    'da16055875638e551f73e81e1252e40d161b3ab47758c376c055f0bc0d4cd8b0'
)