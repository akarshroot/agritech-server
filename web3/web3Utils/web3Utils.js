const fs = require('fs')
const {info}=require('../../utils/logger')
const web3=require('../web3')

function getPrivateKeyFromAccount(account,password){
    info("Getting Users Private Key....")
    const encryptedFile = fs.readdirSync(__dirname+'/../../keystore')
    // info("Encrypted Files->",encryptedFile)
    const requiredPath = encryptedFile.find(e => {
        return e.split("--")[2]===account.slice(2).toLowerCase()
    })
    // info("RequiredFilePath->",requiredPath)
    if(!requiredPath){
        console.log("account Not Found!!")
        return
    }
    const encryptedAccountFile = fs.readFileSync(__dirname+'/../../keystore/'+requiredPath,'utf8')
    info('returning privateKey')
    const key = web3.eth.accounts.decrypt(encryptedAccountFile,password).privateKey.slice(2)
    info('Key--->',key)
    return key
}
module.exports = {getPrivateKeyFromAccount}