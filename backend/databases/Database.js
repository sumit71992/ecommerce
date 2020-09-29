const mongoose = require("mongoose");
const db = mongoose.connect('mongodb+srv://tvastra:sumit1992@cluster0.7mxep.mongodb.net/tvastraplus?retryWrites=true&w=majority',{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
.then(()=>{
    console.warn("db connected");
})
.catch((err)=>{
    console.warn("db not connecting",err);
})
module.exports = db;