const schedule = require('node-schedule')
const {loadContractAt}=require('../web3funding.js');
const web3=require('../web3.js');
const {info}=require('../../utils/logger.js');


function schduleRefundCall(expire,cAddress){
    info("Schduling call...")
    const schduleTime = new Date((expire+2)*1000)
    info("Schdule->",schduleTime)
    schedule.scheduleJob(schduleTime, async () => {
        try{
            const contract = loadContractAt(cAddress);
            const unlockedAcc = await web3.eth.personal.unlockAccount(process.env.BACKEND_COINBASE_WALLET_ADDRESS,process.env.BACKEND_COINBASE_WALLET_PASSWORD,500)
            info("Unlocked ACC",unlockedAcc)
            if(unlockedAcc){
                info("Refund called")
                contract.methods.refund().send({
                    from: process.env.BACKEND_COINBASE_WALLET_ADDRESS
                })
            }else{
                info("Backend Account not unlocked")
            }
        }catch(error){
            info(error.message)
        }
    })
}

module.exports = {schduleRefundCall}