const restpiRoute = require("express").Router();
const { propertyCount, getEnergyStatisticsByProperty } = require("../controllers/restApi");
const authorize = require("../middleware/auth");

restpiRoute.get("/propertyCount", propertyCount);
restpiRoute.get("/:propertyType/:noOfBedrooms",getEnergyStatisticsByProperty);
module.exports = restpiRoute;
