require('dotenv').config()
const solc = require("solc")
const fs = require("fs");
const path = require('path')
// const file = require('@openzeppelin/contracts/token/ERC20/IERC20.sol')

const fileAddress = __dirname+'/contracts/funding2.sol'
const fileAddress2 = process.env.NODE_ENV!=='production'
?__dirname+'../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol'
:"/home/jastagarbrar/agritech-server/node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol"

const readFile = fs.readFileSync(fileAddress,'utf8');
const readFile2 = fs.readFileSync(path.join(__dirname, "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol"),'utf8');

function findImports(path) {
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
const outputContract = output.contracts['funding2.sol'].kissanFundContract2

module.exports = {
    compiledABI:      outputContract.abi,
    compiledByteCode: outputContract.evm.bytecode.object
}
