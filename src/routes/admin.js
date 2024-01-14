const adminRoute = require("express").Router();
const {createVoucher,setPrice,getCurrentPrice, getAllReadings}= require('../controllers/adminController')
const authorize = require("../middleware/auth")
adminRoute.post("/createVoucher", createVoucher);
adminRoute.post("/setPrice",authorize, setPrice);
adminRoute.get("/getCurrentPrice",authorize, getCurrentPrice);
adminRoute.get("/getAllReadings" ,authorize,getAllReadings);
module.exports = adminRoute;
