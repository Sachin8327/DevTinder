const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.mongoose.connect(process.env.MONGO_URI);
};

connectDB().then(() => {
     console.log("database connection established successfully"); 
}).catch((err) => {
     console.log("database connection cann't be established");  
});

module.exports = connectDB;
