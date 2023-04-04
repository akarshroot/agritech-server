const web3 = require('./web3')
const ABI = require("./compile.js").compiledAPi
const bytecode = require("./compile.js").compiledByteCode
const {info}=require("../utils/logger");

// info(ABI)
const contract = new web3.eth.Contract(ABI);

async function deployContract(account,password, target,deadline,minContribution){
    const unlocked = await web3.eth.personal.unlockAccount(account,password)
    if(unlocked){
        const preDeploy = await contract.deploy({ data: bytecode, arguments:[target,deadline,minContribution]})
        info("preDeployed -->",preDeploy)
        const estimateGasFee = await preDeploy.estimateGas()*2
        info("Predicted fee -->",estimateGasFee)
        const deployedContract = await preDeploy.send({ from: account, gas:estimateGasFee })
        info(deployedContract._address)
        return deployedContract
    }else{
        return 'Incorrect Password (Account not Unlocked)'
    }
}

// deployContract('0x879005ce3b64a880e1512d759cecb1bd857590f8',"1234567890", 10000,3600,100)

module.exports = deployContract