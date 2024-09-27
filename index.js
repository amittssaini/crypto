const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const  app = express();
const tradeRouter=require('./Routes/trades.route')

mongoose
.connect(process.env.DB_URI)
.then(()=>{
    console.log(`DB IS CONNECTED`)
    app.listen(process.env.PORT,()=>console.log(`Server is Connected at the port ${process.env.PORT}`))
})
.catch((error)=>console.log('DB IS NOT CONNECTED',error))
app.use(express.json())
app.use('/trades',tradeRouter);