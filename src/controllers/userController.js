const readings = require("../models/readings");
const users = require("../models/users");
const price = require("../models/pricePerUnit");
const vouchers = require("../models/vouchers");
exports.newReading = async (req, res) => {
  try {
    const {
      submissionDate,
      userId,
      electricityReadingDay,
      electricityReadingNight,
      gasReading,
    } = req.body;

    if (
      submissionDate &&
      userId &&
      electricityReadingDay &&
      electricityReadingNight &&
      gasReading
    ) {
      let totalAmount, status, avgGasConsumption, avgElectricityConsumption,avgCostPerDay;
      let priceData = await price.find().sort({ _id: -1 }).limit(1).exec();
      let userData = await users
        .findById(userId)
        .populate({
          path: "readings",
          options: { sort: { _id: -1 } },
        })
        .exec();
      if (userData) {
        if (!userData.readings.length) {
          totalAmount = 0;
          status = "NO PAYMENT REQUIRED";
          avgGasConsumption = 0;
          avgElectricityConsumption = 0;
          avgCostPerDay=0;
        } else {
          let previousDate = new Date(userData.readings[0].submissionDate);
          let currentDate = new Date(submissionDate);
          let noOfDays = Math.ceil(
            Math.abs(currentDate - previousDate) / (1000 * 60 * 60 * 24)
          );
          let previousDayReading = userData.readings[0].electricityReadingDay;
          let previousNightReading =
            userData.readings[0].electricityReadingNight;
          let previousGasReading = userData.readings[0].gasReading;
          console.log(previousDayReading,previousNightReading,previousGasReading)
          totalAmount =
            (electricityReadingDay - previousDayReading) *
              priceData[0].electricityDayPerkWh +
            (electricityReadingNight - previousNightReading) *
              priceData[0].electricityNightkWh +
            (gasReading - previousGasReading) * priceData[0].gasPerkWh +
            priceData[0].standingChargePerDay * noOfDays;
            console.log(totalAmount);
          status = "UNPAID";
          avgGasConsumption = (
            (gasReading - previousGasReading) /
            noOfDays
          ).toFixed(2);
          avgElectricityConsumption = (
            (electricityReadingDay -
              previousDayReading +
              (electricityReadingNight - previousNightReading)) /
            noOfDays
          ).toFixed(2);
          avgCostPerDay=(totalAmount/noOfDays).toFixed(2);
        }
        console.log(totalAmount);
        const readingData = new readings({
          userId: userId,
          submissionDate: new Date(submissionDate),
          electricityReadingDay: electricityReadingDay,
          electricityReadingNight: electricityReadingNight,
          gasReading: gasReading,
          amountToBePaid: totalAmount,
          paymentStatus: status,
          avgGasConsumption: avgGasConsumption,
          avgCostPerDay:avgCostPerDay,
          avgElectricityConsumption: avgElectricityConsumption,
        });
        await readingData
          .save()
          .then(async (data) => {
            userData.readings.push(readingData._id);
            await userData.save();
            res
              .status(200)
              .json({ status: "success", amountToBePaid: totalAmount, data });
          })
          .catch((error) => {
            res.status(500).json({ status: "failed",  error });
          });
      } else {
        res.status(400).json({ status: "failed", error: "USER NOT FOUND" });
      }
    } else {
      res
        .status(400)
        .json({ status: "failed", error: "REQUIRED FIELDS MISSING" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.proceedPayment = async (req, res) => {
  try {
    const { readingId, totalAmount } = req.body;
    if (readingId && totalAmount) {
      let readingData = await readings.findById(readingId);
      let userData = await users.findById(readingData.userId);
      if (readingData) {
        if (
          userData.energy > totalAmount &&
          readingData.paymentStatus != "PAID"
        ) {
          readingData.paymentStatus = "PAID";
          userData.energy = (userData.energy - totalAmount).toFixed(2);
          await readingData
            .save()
            .then(async (data) => {
              await userData.save();
              res.status(200).json({ status: "success", data });
            })
            .catch((error) => {
              res.status(500).json({ status: "failed", error });
            });
        } else {
          let error =
            readingData.paymentStatus == "PAID"
              ? "ALREADY PAID"
              : "NOT ENOUGH ENERGY";
          res.status(400).json({ status: "failed", error });
        }
      } else {
        res.status(400).json({ status: "failed", error: "READING NOT FOUND" });
      }
    } else {
      res
        .status(400)
        .json({ status: "failed", error: "REQUIRED FIELDS MISSING" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.energyTopUp = async (req, res) => {
  try {
    const { userId, voucherCode } = req.body;
    if (userId && voucherCode) {
      users
        .findById(userId)
        .then((data) => {
          if (data) {
            if (!data.voucherCode.includes(voucherCode)) {
              vouchers
                .find({ voucherCode: voucherCode })
                .then(async (result) => {
                  if (result.length) {
                    data.voucherCode.push(voucherCode);
                    data.energy = (data.energy + result[0].energy).toFixed(2);
                    await data.save();
                    res.status(200).json({ status: "success", data });
                  } else {
                    res
                      .status(400)
                      .json({ status: "failed", error: "INVALID VOUCHER" });
                  }
                })
                .catch((error) => {
                  res.status(500).json({ status: "failed", error });
                });
            } else {
              res
                .status(400)
                .json({ status: "failed", error: "VOUCHER ALREADY USED" });
            }
          } else {
            res.status(400).json({ status: "failed", error: "USER NOT FOUND" });
          }
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

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    if(userId){
    await users.findById(userId).populate("readings").exec().then(data=>{
        res.status(200).json({status:"success",data});
    }).catch (error=> {
        res.status(500).json({ status: "failed", error });
      });
        
    }else{
        res.status(400).json({status:"failed",error:"REQUIRED FIELDS MISSING"});
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};
