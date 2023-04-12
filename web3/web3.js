require("dotenv").config()
const Web3 = require("web3");


const web3 = process.env.NODE_ENV === 'production'
    ?new Web3('http://localhost:8545')
    :new Web3('http://34.131.60.175')
// const web3 = new Web3('http://34.131.90.34');

module.exports = web3