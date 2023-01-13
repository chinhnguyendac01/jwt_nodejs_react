const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");
//get all users
const router = require("express").Router();
router.get("/",middlewareController.verifyToken,userController.getAllUsers);
//delete user
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);
module.exports = router