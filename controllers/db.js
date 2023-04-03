// db.js
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_PASS}@maincluster.yajbyem.mongodb.net/?retryWrites=true&w=majority`, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true
}, (err) => {
   if (!err) {
      console.log('MongoDB Connection Succeeded.')
   } else {
      console.error('Error in DB connection: ' + err)
   }
});