// const Caddress = require('./ABIs')
const Caddress = '0x412fBbB6f6711A30a19dF07380508C42f2D9F5b1'

const transferToWalletMessageToSign = (owner,toAddress,nonce,value) => {
    return {
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
}
const contributeMessageToSign = (contractAddress,amount,sender) => {
    return {
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
      name: "KissanCoinsContract",
      version: "1",
      chainId: 1337,
      verifyingContract: contractAddress
    },
    message: {
      amount,
      sender
    }}
}
const createRequestMessageToSign = (contractAddress,a,amount) => {
    return {
        types: {
        EIP712Domain: [
            {name: "name",type: "string"},
            {name: "version",type: "string"},
            {name: "chainId",type: "uint256"},
            {name: "verifyingContract",type: "address"}
        ],
        Createrequest: [
          {name: "amount",type: "uint256"},
          {name: "a",type: "address"}
        ],
      },
      primaryType: "Createrequest",
      domain: {
        name: "KissanCoinsContract",
        version: "1",
        chainId: 1337,
        verifyingContract: contractAddress
      },
      message: {
        amount,
        a
      }}
}
const voteRequestMessageToSign = (contractAddress,number,sender) => {
    return {types: {
      EIP712Domain: [
        {name: "name",type: "string"},
        {name: "version",type: "string"},
        {name: "chainId",type: "uint256"},
        {name: "verifyingContract",type: "address"}
      ],
      VoteIn: [
        {name: "number",type: "uint256"},
        {name: "sender",type: "address"}
      ],
    },
    primaryType: "VoteIn",
    domain: {
      name: "KissanCoinsContract",
      version: "1",
      chainId: 1337,
      verifyingContract: contractAddress
    },
    message: {
      number,
      sender
    }}
}
const transferToBuyMessageToSign = (contractAddress,number,sender) => {
    return {types: {
      EIP712Domain: [
        {name: "name","type": "string"},
        {name: "version","type": "string"},
        {name: "chainId","type": "uint256"},
        {name: "verifyingContract","type": "address"}
      ],
      TransferToBuy: [
          {name: "number",type: "uint256"},
          {name: "sender",type: "address"}
      ],
    },
    primaryType: "TransferToBuy",
    domain: {
      name: "KissanCoins",
      version: "1",
      chainId: "1337",
      verifyingContract: contractAddress
    },
    message: {
      number,
      sender
    }}
}

module.exports ={
    transferToWalletMessageToSign,
    createRequestMessageToSign,
    contributeMessageToSign,
    voteRequestMessageToSign,
    transferToBuyMessageToSign
}