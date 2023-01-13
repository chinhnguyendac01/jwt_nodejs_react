const User = require("../models/User.js");

const userController = {
     //get all user
     getAllUsers:async(req,res)=>{
          try{
               const user = await User.find();
               return res.status(200).json(user)
          }catch(err)
          {
               return res.status(500).json(err)
          }
     },
     //delete user
     deleteUser:async(req,res)=>{
          try{
               const user = await User.findById(req.params.id)
               return res.status(200).json("Delete sucessfully");
               
          }catch(err){
               return res.status(500).json(err);
          }
     }

}
module.exports = userController