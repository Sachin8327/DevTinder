const mongoose=require("mongoose");
const { trim } = require("validator");
const validator= require("validator");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        maxlength:50,
        minlength:3,
    },
    lastName:{
        type:String,
        required:true,
        maxlength:50,
        minlength:3,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not valid"+value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","Female","other"].includes(value)){
                throw new Error("Invalid gender data");
            }
        }    
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("photoUrl is not valid");
            }
        }
    },
    about:{
        type:String,
        maxlength:80,
        default:"Hey there! I am using DevTinder."
    },
    skills:{
        type:[String],
        default:[],
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("please enter correct/strong pasword ");
            }
        }
    },

},
{
    timestamps:true,
});

userSchema.methods.getJWTToken = async function(){
    const user = this;

    const token = await jwt.sign({ _id: user._id}, "password", {expiresIn: "1h"});
    return token;
};
userSchema.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

const userModel= mongoose.model("User",userSchema);
module.exports=userModel;



