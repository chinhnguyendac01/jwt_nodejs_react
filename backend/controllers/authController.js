const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashsed = await bcrypt.hash(req.body.password, salt);
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashsed,
      });
      const user = await newUser.save();
      return res.status(200).json(user);
    } catch (err) {
      return  res.status(500).json(err);
    }
  },
  //GENERATE ACCESS TOKEN 
  generateAccessToken: (user) =>{
     return jwt.sign(
          {
            id: user.id,
            admin: user.admin,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "30s" }
        );
  },
  //GENERATE REFRESH TOKEN
  generateRefreshToken: (user)=>{
       return jwt.sign(
          {
               id: user.id,
               admin: user.admin,
             },
             process.env.JWT_REFRESH_KEY,
             { expiresIn: "30s" }
        );
  },
  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
       return  res.status(404).json("wrong username!");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken",refreshToken,{
          httpOnly:true,
          secure:false,
          path:"/",
          sameSite:"strict",
        })
        const { password, ...other } = user._doc;
        return res.status(200).json({ ...other, accessToken });
      }
    } catch (err) {
     return  res.status(500).json(err);
    }
  },

  requestRefreshToken: async(req,res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if(!refreshToken) return res.status(401).json("You're not authenticated");
   
    jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY,(err,user)=>{
      if(err)
      {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token)=>token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        path:"/",
        sameSite:"strict",
      });
      res.status(200).json({accessToken:newAccessToken,
      refreshToken:newRefreshToken});
    });
  },
  userLogout: async(req,res)=>{
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(200).json("Logger out !");
  }
};
module.exports = authController;
 