require("dotenv").config()
const Web3 = require("web3");
var web3;
try{
    web3 = process.env.NODE_ENV === 'production'
        ?new Web3('http://localhost:8545')
        :new Web3('http://20.101.34.184')
}catch(error){
    err(error.message,'(try changing network)')
}
    // const web3 = new Web3('http://34.131.90.34');
module.exports = web3