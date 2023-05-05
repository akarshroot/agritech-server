const {Caddress} = require('./ABIs')

const EIP712Domain = [
  {name: "name","type": "string"},
  {name: "version","type": "string"},
  {name: "chainId","type": "uint256"},
  {name: "verifyingContract","type": "address"}
]

const ContractDomain = {
  name: "KissanCoinsContract",
  version: "1",
  chainId: 1337,
}


const permitWalletMessageToSign = (owner,toAddress,nonce,value) => {
    console.log("Coins Addess",Caddress)
    return {
        types: {
          EIP712Domain,
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
}


const contributeMessageToSign = (contractAddress,amount,sender) => {
    return {
      types: {
      EIP712Domain,
      Contribute: [
          {name: "amount",type: "uint256"},
          {name: "sender",type: "address"}
      ],
    },
    primaryType: "Contribute",
    domain: {
      ...ContractDomain,
      verifyingContract: contractAddress
    },
    message: {
      amount,
      sender
    }}
}
const createRequestMessageToSign = (contractAddress,receiver,amount) => {
    return {
        types: {
        EIP712Domain,
        Creater: [
          {name: "amount",type: "uint256"},
          {name: "receiver",type: "address"}
        ],
      },
      primaryType: "Creater",
      domain: {
        ...ContractDomain,
        verifyingContract: contractAddress
      },
      message: {
        amount,
        receiver
      }}
}
const voteRequestMessageToSign = (contractAddress,number,sender) => {
    return {types: {
      EIP712Domain,
      VoteIn: [
        {name: "number",type: "uint256"},
        {name: "sender",type: "address"}
      ],
    },
    primaryType: "VoteIn",
    domain: {
      ...ContractDomain,
      verifyingContract: contractAddress
    },
    message: {
      number,
      sender
    }}
}
const transferToBuyMessageToSign = (contractAddress,number,sender) => {
    return {types: {
      EIP712Domain,
      UseReq: [
          {name: "number",type: "uint256"},
          {name: "sender",type: "address"}
      ],
    },
    primaryType: "UseReq",
    domain: {
      ...ContractDomain,
      verifyingContract: contractAddress
    },
    message: {
      number,
      sender
    }}
}

module.exports ={
    permitWalletMessageToSign,
    createRequestMessageToSign,
    contributeMessageToSign,
    voteRequestMessageToSign,
    transferToBuyMessageToSign
}