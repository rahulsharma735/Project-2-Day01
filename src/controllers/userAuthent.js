const redisClient = require("../config/redis");
const User = require("../models/user")
const validate = require("../utils/validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// app.use(express.json());

const register = async (req, res)=>{
    try{

        //Validate the data
        // validate(req.body)
        validate({ ...req.body, email: req.body.emailId });

        const {firstName, emailId, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        req.body.role = 'user';

        //
        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token', token, {maxAge:60*60*1000});
        res.status(201).send("User Register Successfully");

    }
    catch(err){
        res.status(400).send("Error :"+err.message);
    }
}

const login = async (req, res)=>{
    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const match = bcrypt.compare(password, user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const token = jwt.sign({_id:user._id, emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token', token, {maxAge:60*60*1000});

        res.status(200).send("logged In Successfully");
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}

const logout = async (req, res) =>{
    try{
        
        // validate the token
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,`Blocked`);
        await redisClient.expireAt(`token:${token}`,payload.exp);
        // token add kar dunga Redis ke blockList 
        // Cookies ko clear kar dena ....

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Looged Out Succesfully");

    }
    catch(err){
        res.status(505).send("Error: "+err.message);
    }
}

const adminRegister = async (req, res)=>{
     try{

        //Validate the data
        // validate(req.body)
        validate({ ...req.body, email: req.body.emailId });

        const {firstName, emailId, password} = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        // req.body.role = 'admin';

        //
        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token', token, {maxAge:60*60*1000});
        res.status(201).send("User Register Successfully");

    }
    catch(err){
        res.status(400).send("Error :"+err.message);
    }
}

module.exports = {register, login, logout,adminRegister};