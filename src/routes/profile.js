const express = require("express");
const profileRouter = express.Router();;
const {userAuth}=require("../middlewares/auth");
const {validateEditProfileData}=require("../util/validation");

profileRouter.get("/profile/view", userAuth,async (req, res) => {
    try {
          const user = req.user;
          res.send(user);
     } catch (err) {
          res.status(400).send("Error in fetching profile data" + err);
     }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit fields");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);
        res.send("Profile updated successfully");  
    } catch (err) {
        res.status(400).send("Error in editing profile data" + err);
    }
});

module.exports=profileRouter;



