var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    userId: String,
    password: String,
    address: String,
    propertyType: String,
    numberOfBedrooms: Number,
    voucherCode: Array,
    energy: Number,
    readings: [
      {
        type: ObjectId,
        ref: "readings",
      },
    ],
    role: String,
  }
);
module.exports = mongoose.model("users", userSchema);
