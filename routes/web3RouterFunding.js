const User=require("../models/User");
const Campaign=require("../models/Campaign");
const {info}=require("../utils/logger");
const deployContract=require("../web3/deploy");
const {loadContractAt, getRaisedAmount}=require("../web3/web3funding")

const web3RouterFunding = require("express").Router()

web3RouterFunding.get("/:id", async (req,res) => {
    const contract = loadContractAt(req.params.id);
    const raisedAmount =await getRaisedAmount(contract);
    res.send({
        raisedAmount
    })
})

web3RouterFunding.post('/deployContract',async (req,res) => {
    const testContractAddress = 'THIS IS A TEST CONTRACT ADDRESS'
    const data = req.body
    info(data)
    const manager = await User.findById(data.userId)
    info(manager)
    const newContractModel = new Campaign({
        title:data.title,
        address: testContractAddress,
        target: data.target,
        deadline: data.deadline,
        minContri: data.minContribution,
        date: new Date(),
        manager: manager._id
    })
    const saved = await newContractModel.save()
    info(saved)
    manager.ownedContracts.push(saved._id.toString())
    await manager.save()
    // info(address._address)
    res.json({
        status:"Deployed Successfully",
        // address:address._address
    })

})
// web3RouterFunding.post('/deployContract',async (req,res) => {
//     const data = req.body
//     info(data)

//     const address = await deployContract(
//         data.walletAddress,
//         data.password,
//         data.target,
//         data.deadline,
//         data.minContribution,
//     )
    
//     if(address!=='Incorrect Password (Account not Unlocked)'){
//         const newContractModel = new Campaign({
//             title:data.title,
//             address: data.walletAddress,
//             target: data.target,
//             deadline: data.deadline,
//             minContri: data.minContribution,
//             date: new Date(),
//             // manager: 'UserIDhere'
//         })

//         info(newContractModel)
//         info(address._address)
//         res.json({
//             status:"Deployed Successfully",
//             address:address._address
//         })
//     }

// })


module.exports = web3RouterFunding