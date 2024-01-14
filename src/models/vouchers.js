var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const voucherSchema = new mongoose.Schema(
  {
    voucherCode: String,
    energy: Number,
    userId: [
      {
        type: ObjectId,
        ref: "users",
      },
    ],
  }
);
module.exports = mongoose.model("vouchers", voucherSchema);
