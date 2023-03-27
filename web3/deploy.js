const {web3} = require('./web3')
const ABI = require("./compile.js").compiledAPi
const bytecode = require("./compile.js").compiledByteCode
const driverAddres = '0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637'

// console.log("ABI-->",ABI)
// console.log("ByteCode-->",bytecode)

// const fundingContract = new web3.eth.Contract(ABI)
// console.log("Contract-->",fundingContract)

// async function deployFundingContract(){
//     web3.eth.getAccounts().then((accounts)=>{
//         console.log("Accounts:",accounts)
//         const defaultAccount = accounts[0]
//         fundingContract.deploy({data:bytecode})
//           .send({
//             from:defaultAccount,
//             gas: 500000000000
//            })
//           .on('receipt',(receipt) => {
//             console.log(receipt)
//           })
//     })
// }


console.log(ABI)
contract = new web3.eth.Contract(ABI);
web3.eth.getAccounts().then((accounts) => {
    console.log("Accounts:", accounts);
 
    mainAccount = accounts[0];
    console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: bytecode })
        .send({ from: mainAccount, gas: 470000 })
        .on("receipt", (receipt) => {
 
            // Contract Address will be returned here
            console.log("Contract Address:", receipt.contractAddress);
        })
        .then((initialContract) => {
            initialContract.methods.message().call((err, data) => {
                console.log("Initial Data:", data);
            });
        });
});



// deployFundingContract()
// module.exports = deployFundingContract

// console.log(web3)