const express = require("express");
const profileRouter = express.Router();;
const {userAuth}=require("../middlewares/auth");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    // Return logged-in user's basic profile for now
    const user = req.user;
    if (!user) return res.status(401).send("unauthenticated");
    res.json({ firstName: user.firstName, lastName: user.lastName, emailId: user.emailId, about: user.about, skills: user.skills });
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) return res.status(401).send("unauthenticated");
        // minimal allowed updates
        const allowed = ["photoUrl", "about", "age", "skills"];
        const updates = Object.keys(req.body);
        if (!updates.every((k) => allowed.includes(k))) return res.status(400).send("invalid Edit Request");
        updates.forEach((k) => {
            loggedInUser[k] = req.body[k];
        });
        await loggedInUser.save();
        res.send("profile updated");
    } catch (err) {
        res.status(400).send("error" + err.message);
    }
});
module.exports=profileRouter;