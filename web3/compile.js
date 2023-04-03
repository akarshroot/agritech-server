const solc = require("solc")
const fs = require("fs")

const fileAddress = __dirname+'/contracts/funding.sol'
const readFile = fs.readFileSync(fileAddress,'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'funding.sol': {
        content: readFile.toString()
        }
    },
    settings: {
        outputSelection: {
        '*': {
            '*': ['*']
        }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const outputContract = output.contracts['funding.sol'].kissanFundContract

module.exports = {
    compiledAPi:      outputContract.abi,
    compiledByteCode: outputContract.evm.bytecode.object
}
