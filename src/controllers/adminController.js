const vouchers = require("../models/vouchers");
const price = require("../models/pricePerUnit");
const readings = require("../models/readings");
exports.createVoucher = async (req, res) => {
  try {
    const { voucherCode, energy } = req.body;
    if (voucherCode && energy) {
      vouchers
        .find({ voucherCode: voucherCode })
        .then(async (data) => {
          if (data.length) {
            res.status(400).json("VOUCHER CODE ALREADY EXISTS");
          } else {
            const voucher = new vouchers({
              voucherCode: voucherCode,
              energy: energy,
            });
            await voucher
              .save()
              .then((result) => {
                res.status(200).json({ status: "success", data: result });
              })
              .catch((error) => {
                res.status(500).json({ status: "failed",error });
              });
          }
        })
        .catch((error) => {
          res.status(500).json({ status: "failed",  error });
        });
    } else {
      res
        .status(400)
        .json({ status: "failed", error: "REQUIRED FIELDS MISSING" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.setPrice = async (req, res) => {
  try {
    const {
      electricityDayPerkWh,
      electricityNightkWh,
      gasPerkWh,
      standingChargePerDay,
    } = req.body;

    if (
      electricityDayPerkWh &&
      electricityNightkWh &&
      gasPerkWh &&
      standingChargePerDay
    ) {
      const setPrice = new price({
        electricityDayPerkWh: electricityDayPerkWh,
        electricityNightkWh: electricityNightkWh,
        gasPerkWh: gasPerkWh,
        standingChargePerDay: standingChargePerDay,
      });
      await setPrice
        .save()
        .then((data) => {
          res.status(200).json({ status: "success", data });
        })
        .catch((error) => {
          res.status(500).json({ status: "failed", error });
        });
    } else {
      res
        .status(400)
        .json({ status: "failed", error: "REQUIRED FIELDS MISSING" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.getCurrentPrice = async (req, res) => {
  price
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .exec()
    .then((data) => {
      res.status(200).json({ status: "success", data });
    })
    .catch((error) => {
      res.status(500).json({ status: "failed", error });
    });
};

exports.getAllReadings = async (req, res) => {
  try {
    readings
      .find().populate("userId").sort({userId:-1})
      .then((data) => {
        res.status(200).json({ status: "success", data });
      })
      .catch((error) => {
        res.status(500).json({ status: "failed", error });
      });
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};
