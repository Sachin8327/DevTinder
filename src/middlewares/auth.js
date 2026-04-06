const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAuthorised = token === "xyz";
    if (!isAuthorised){
        return res.status(401).send("Unauthorized access");
    }else{
        next();
    } 
};


// const userAuth kam ka hai iska use hua hai auth.js me , ye jwt token dene ke liye use hua hai .
const userAuth=async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
             return res.status(401).send("Please Login!");
        }
        const decodedObj = await jwt.verify(token, "password");
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized access: " + err);
    }   
};

// const  userAuth = (req, res, next) => {
//     const token = "xyz";
//     const isAuthorised = token === "ayz";
//     if (!isAuthorised){
//         return res.status(401).send("Unauthorized access");
//     }else{
//         next();
//     } 
// };

module.exports = { adminAuth, userAuth };

