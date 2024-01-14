var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const readingsSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "users",
    },
    submissionDate: Date,
    electricityReadingDay: Number,
    electricityReadingNight: Number,
    gasReading: Number,
    amountToBePaid: Number,
    paymentStatus: String,
    avgGasConsumption: Number,
    avgElectricityConsumption: Number,
    avgCostPerDay:Number
  }
);
module.exports = mongoose.model("readings", readingsSchema);
