const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/current", passport.authenticate("jwt", {session:false}), userController.current);       
router.get("/admin", passport.authenticate("jwt", {session:false}), userController.admin);

module.exports = router;
