// const Product = require('../models/Product')
// const User=require('../models/User')
// const mongoose = require('mongoose')
// const {info}=require('../utils/logger')
const web3 = require("./web3")
// mongoose.connect('mongodb+srv://admin:admin@maincluster.yajbyem.mongodb.net/?retryWrites=true&w=majority').then(() => {
//     changeSoldBy()
// })
web3.eth.personal.unlockAccount('0x879005CE3b64A880E1512D759CEcb1bd857590F8','1234567890').then(e => console.log(e))
// async function changeSoldBy(){
//     const products = await Product.find({})
//     const Adminuser = await User.findById('642c42213607d4e5a862b9cc')
//     info('Brfore',products)
//     products.forEach(async (e) => {
//         e.soldBy = Adminuser._id
//         e.category = 'all'
//         await e.save()
//     })
//     info('After',products)
// }
