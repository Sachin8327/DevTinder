const mongoose = require("mongoose");

const connectDB = async () => {
   await mongoose.mongoose.connect(" "
   );
};
connectDB().then(() => {
     console.log("database connection established successfully"); 
}).catch((err) => {
     console.log("database connection cann't be established");  
});

module.exports = connectDB;
