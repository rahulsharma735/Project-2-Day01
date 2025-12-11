const express = require('express');
const app = express();
const main = require("./config/db");
require('dotenv').config();
const cookieParser = require("cookie-parser");
// const User = require("./config/db");
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');

app.use(express.json()); 
app.use(cookieParser());

app.use("/user",authRouter);

const InitializeConnection = async()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");

        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: " + process.env.PORT);
        })
        
    }
    catch(err){
        console.log("Error: "+err.message);
        
        // res.send("Error: "+err.message);
    }
}

InitializeConnection();

// main()
// .then(async ()=>{
    //     app.listen(process.env.PORT, ()=>{
    //     console.log("Server listening at port number: " + process.env.PORT);
    // })
// })
// .catch(err=>console.log("Error Occured: "+err))
