const auth=require('../middleware/auth')

const web3RouterVoting = require('express').Router()

web3RouterVoting.post('/makeRequest',auth, async (req,res) => {
    
    res.send('make request')
})

module.exports = web3RouterVoting