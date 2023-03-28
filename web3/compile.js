const solc = require("solc")
const fs = require("fs")

const fileAddress = './contracts/funding.sol'
const readFile = fs.readFileSync(fileAddress,'utf8');

// console.log(readFile.toString())

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

// console.log(output)
// console.log(outputContract.abi)

module.exports = {
    compiledAPi:      outputContract.abi,
    compiledByteCode: outputContract.evm.bytecode.object
}
