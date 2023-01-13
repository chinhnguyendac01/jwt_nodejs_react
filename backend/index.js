const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRouter = require("./routes/user")
const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URL,()=>{
     console.log("connect to mongoDB")
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());
//ROUTES
app.use("/v1/auth",authRoute)
app.use("/v1/user",userRouter)
app.listen(8000, ()=>{
     console.log("Server is running");
});