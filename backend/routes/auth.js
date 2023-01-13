const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

//register
router.post("/register",authController.registerUser);

//LOGIN
router.post("/login",authController.loginUser);

//REFRESH
router.post("/refresh",authController.requestRefreshToken);

router.post("/logout",middlewareController.verifyToken,authController.userLogout)
module.exports = router;
