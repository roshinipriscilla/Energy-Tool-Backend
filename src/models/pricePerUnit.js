var mongoose = require("mongoose");
const priceSchema = new mongoose.Schema(
  {
    electricityDayPerkWh: Number,
    electricityNightkWh: Number,
    gasPerkWh: Number,
    standingChargePerDay: Number
  }
);
module.exports = mongoose.model("price", priceSchema);
