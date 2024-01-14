const userRoute = require("express").Router();
const {newReading, proceedPayment, energyTopUp, getUserProfile}= require('../controllers/userController')
const authorize = require("../middleware/auth");
userRoute.post("/newReading",authorize, newReading);
userRoute.post("/payment",authorize, proceedPayment);
userRoute.post("/energyTopUp",authorize, energyTopUp);
userRoute.post("/getUserProfile",authorize, getUserProfile);
module.exports = userRoute;
