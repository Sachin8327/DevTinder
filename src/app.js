const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validatorSignupData } = require("./util/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
     try {
          validatorSignupData(req);
          const { firstName, lastName, emailId, password } = req.body;
          const passwordHash = await bcrypt.hash(password, 10);
          console.log(passwordHash);

          const user = new User({
               firstName,
               lastName,
               emailId,
               password: passwordHash
          });
          await user.save();
          res.send("user added successfully");
     } catch (err) {
          res.status(400).send("Error  in signing up" + err);
     }
});

//app.get likh ker try kiya gaya tha 
app.post("/login", async (req, res) => {
     try {
          const { emailId, password } = req.body;
          const user = await User.findOne({ emailId: emailId });
          if (!user) {
               throw new Error("invalid credentials");
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
               const token = await jwt.sign({ _id: user._id}, "password", {expiresIn: "1h"});
               console.log(token);
               res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});
               res.send("login successful");
          } else {
               throw new Error("invalid credentials");
          }
     } catch (err) {
          res.status(400).send("Error in logging in" + err);
     }
});

app.get("/profile", userAuth,async (req, res) => {
     try {
          const user = req.user;
          res.send(user);
     } catch (err) {
          res.status(400).send("Error in fetching profile data" + err);
     }
});


app.post("/sendConnectionRequest", userAuth, async (req, res) => {
     const user = req.user;
     console.log("sending a connection Request");
     res.send(user.firstName+" sent the connection request");
});


app.get("/user", async (req, res) => {
     const userEmail = req.body.emailId;
     try {
          const user = await User.find({ emailId: userEmail });
          if (user.length === 0) {
               return res.status(404).send("User not found");
          } else {
               res.send(user);
          }

     } catch (err) {
          res.status(400).send("Error in fetching user data" + err);
     }
});


app.get("/feed", async (req, res) => {
     try {
          const users = await User.find({});
          res.send(users);
     } catch (err) {
          res.status(400).send("Error in fetching feed data" + err);
     }
});


app.delete("/user", async (req, res) => {
     const userId = req.body.userId;
     try {
          const user = await User.findByIdAndDelete(userId);
          res.send("User deleted successfully");
     } catch (err) {
          res.status(400).send("Error deleting user: " + err);
     }
});



app.patch("/user/:userId", async (req, res) => {
     const userId = req.params?.userId;
     const data = req.body;
     try {
          const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "skills", "age", "gender"];

          const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
          if (!isUpdateAllowed) {
               throw new Error("update not allowed");
          }
          const user = await User.findByIdAndUpdate({ _id: userId }, data, { new: true, runValidators: true });
          console.log(user);
          res.send("User data updated successfully");
     } catch (err) {
          res.status(400).send("Error in updating user data" + err);
     }
});









app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.get("/admin/getAllData", (req, res) => {
     res.send("All data  sent");
});

app.get("/admin/deleteUser", (req, res) => {
     res.send("admin deleted");
});
app.get("/user/login", (req, res) => {
     res.send("User logged in successfully");
});

connectDB().then(() => {
     console.log("database connection established successfully");
     app.listen(7777, () => {
          console.log("Server is running on port 7777");
     });
}).catch((err) => {
     console.log("database connection cann't be established");
});

