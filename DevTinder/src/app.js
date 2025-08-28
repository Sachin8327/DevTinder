const express =require("express");
 const app=express();

   app.use("/hello",(req,res)=>{
           res.send("Hello from server");
   });


app.listen(7777,()=>{
    console.log("Sever is successfully listening to port 7777");
 });




