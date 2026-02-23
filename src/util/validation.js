const validator= require("validator");

 const validatorSignupData=(req)=>{
    const { firstName, lastName, emailId, password }= req.body;
    if(!firstName || !lastName ){
        throw new Error("name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");
    }
    };

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","age","gender","photoUrl","about","skills","emailId"];

    const isEditAllowed= Object.keys(req.body).every((field)=>{
        return allowedEditFields.includes(field);
    });
    return isEditAllowed;
};

    module.exports={
        validatorSignupData,
        validateEditProfileData
    }
