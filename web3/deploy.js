const {web3} = require('./web3')
const ABI = require("./compile.js").compiledAPi
const bytecode = require("./compile.js").compiledByteCode

console.log(ABI)
const contract = new web3.eth.Contract(ABI);

async function deployContract(account){
    const preDeploy = await contract.deploy({ data: bytecode, arguments:[10000,3600,100]})
    console.log("preDeployed -->",preDeploy)
    const estimateGasFee = await preDeploy.estimateGas()*1.5
    console.log("Predicted fee -->",estimateGasFee)
    const deployedContract = await preDeploy.send({ from: account, gas:estimateGasFee })
    console.log(deployedContract._address)
    return deployedContract
}

deployContract('0x2ee4961905E3c9B6eC890d5F919224Ad6BD87637')

module.exports = deployContract
// deployFundingContract()
// module.exports = deployFundingContract

// console.log(web3)