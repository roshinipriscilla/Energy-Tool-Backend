const authRoute = require("express").Router();
const {userSignup,userLogin, getAccessToken}= require('../controllers/authController');
const authorize = require("../middleware/auth");

authRoute.post("/userSignup", userSignup);
authRoute.post("/userLogin", userLogin);
authRoute.post("/getAccessToken",authorize.refreshAccessToken ,getAccessToken);
module.exports = authRoute;
