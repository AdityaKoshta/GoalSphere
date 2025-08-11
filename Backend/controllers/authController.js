const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({msg : "User already Exists"});
        }

        const hashedPwd = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPwd});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "7D"});

        res.status(200).json({
            token, 
            user: {id: user._id, name: user.name, email: user.email}
        });
    }
    catch(err){
        console.log("Login Error :", err);
       res.status(500).json({msg: "Server Error"});
    }

};    

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: "User doesn't Exits"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({msg: "Invalid Credentials in Backend"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "7D"});

        res.status(200).json({
            token, 
            user: {id: user._id, name: user.name, email: user.email}
        });
    }
    catch(err){
        console.log("Login Error :", err);
        res.status(500).json({msg: "Server Error"});
    }
} 
    
