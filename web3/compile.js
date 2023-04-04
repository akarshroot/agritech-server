const solc = require("solc")
const fs = require("fs");
const {info}=require("../utils/logger");

const fileAddress = __dirname+'/contracts/funding2.sol'
const fileAddress2 = __dirname+'/contracts/IERC20.sol'
const readFile = fs.readFileSync(fileAddress,'utf8');
const readFile2 = fs.readFileSync(fileAddress2,'utf8');

function findImports(path) {
    info(path)
      return {
        contents:
          readFile2
      }
  }

var input = {
    language: 'Solidity',
    sources: {
        'funding2.sol': {
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

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
// info(output)
const outputContract = output.contracts['funding2.sol'].kissanFundContract

module.exports = {
    compiledAPi:      outputContract.abi,
    compiledByteCode: outputContract.evm.bytecode.object
}
