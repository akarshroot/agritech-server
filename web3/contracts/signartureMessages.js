const {info}=require('../../utils/logger')
const {Caddress} = require('./ABIs')

const EIP712Domain = [
  {name: "name",type: "string"},
  {name: "version",type: "string"},
  {name: "chainId",type: "uint256"},
  {name: "verifyingContract",type: "address"}
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
    info("-----------------")
    info("contractAddress",contractAddress)
    info("receiver",receiver)
    info("amount",amount)
    info("-----------------")
    return {
      types: {
      EIP712Domain,
      CreateRequest: [
        {name: "amount",type: "uint256"},
        {name: "receiver",type: "address"}
        ]
      },
      primaryType: "CreateRequest",
      domain: {
        ...ContractDomain,
        verifyingContract: contractAddress
      },
      message: {
        amount,
        receiver
      }}
}
const voteRequestMessageToSign = (contractAddress,number) => {
    return {types: {
      EIP712Domain,
      VoteRequest: [
        {name: "number",type: "uint256"}
      ],
    },
    primaryType: "VoteRequest",
    domain: {
      ...ContractDomain,
      verifyingContract: contractAddress
    },
    message: {
      number
    }}
}
const transferToBuyMessageToSign = (contractAddress,number) => {
    return {types: {
      EIP712Domain,
      TransferToBuy: [
          {name: "number",type: "uint256"}
      ]
    },
    primaryType: "TransferToBuy",
    domain: {
      ...ContractDomain,
      verifyingContract: contractAddress
    },
    message: {
      number
    }}
}

module.exports ={
    permitWalletMessageToSign,
    createRequestMessageToSign,
    contributeMessageToSign,
    voteRequestMessageToSign,
    transferToBuyMessageToSign
}