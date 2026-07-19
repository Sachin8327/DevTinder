require("dotenv").config();
const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validatorSignupData } = require("./util/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(cors({
     origin: "http://localhost:5173",
     credentials: true,
}
));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


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


app.get("/feeed", async (req, res) => {
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


connectDB().then(() => {
     console.log("database connection established successfully");
     app.listen(7777, () => {
          console.log("Server is running on port 7777");
     });
}).catch((err) => {
     console.log("database connection cann't be established");
});

