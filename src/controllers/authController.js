const users = require("../models/users");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const vouchers = require("../models/vouchers");
exports.userSignup = async (req, res) => {
  try {
    const {
      userId,
      password,
      address,
      propertyType,
      numberOfBedrooms,
      voucherCode,
    } = req.body;
    if (
      userId &&
      password &&
      address &&
      propertyType &&
      numberOfBedrooms &&
      voucherCode
    ) {
      users
        .find({ userId: userId })
        .then(async (data) => {
          if (!data.length) {
            let encryptedPassword = CryptoJS.AES.encrypt(
              password,
              "secretKey"
            ).toString();
            await vouchers
              .findOne({ voucherCode: voucherCode })
              .then(async (data) => {
                if (data) {
                  const user = new users({
                    userId: userId,
                    password: encryptedPassword,
                    address: address,
                    propertyType: propertyType,
                    numberOfBedrooms: numberOfBedrooms,
                    voucherCode: voucherCode,
                    energy: data.energy,
                    role: "user",
                  });
                  data.userId.push(user._id);
                  await data.save();
                  await user
                    .save()
                    .then(async (data) => {
                      res.status(200).json({status: "success" });
                    })
                    .catch((error) => {
                      res.status(400).json({ error, status: "failed" });
                    });
                } else {
                  res.status(400).json({error:"INVALID VOUCHER"});
                }
              });
          } else {
            res
              .status(400)
              .json({ status: "failed", error: "USER ALREADY EXISTS" });
          }
        })
        .catch((error) => {
          res.status(500).json({ status: "failed", error });
        });
    } else {
      res
        .status(400)
        .json({ error: "REQUIRED FIELDS MISSING", status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if ((userId, password)) {
      users.findOne({ userId: userId }).then((data) => {
        if (data) {
          let decryptedPassword = CryptoJS.AES.decrypt(
            data.password,
            "secretKey"
          ).toString(CryptoJS.enc.Utf8);
          if (decryptedPassword == password) {
            const accessToken = jwt.sign(
              {
                userId: data.userId,
              },
              "accessToken",
              {
                expiresIn: 3600,
              }
            );
            const refreshToken = jwt.sign(
              {
                userId: data.userId,
              },
              "refreshToken",
              {
                expiresIn: 840000,
              }
            );
            res.status(200).json({
              status: "success",
              accessToken: accessToken,
              refreshToken: refreshToken,
              userId: data._id,
              role:data.role
            });
          } else {
            res
              .status(400)
              .json({ status: "failed", error: "PASSWORD DOESN'T MATCH" });
          }
        } else {
          res.status(400).json({ status: "failed", error: "USER NOT FOUND" });
        }
      });
    } else {
      res
        .status(400)
        .json({ error: "REQUIRED FIELDS MISSING", status: "failed" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", error });
  }
};

exports.getAccessToken = async(req,res)=>{
  try{
    const refreshToken = req.headers.authorization
    const {accessToken}= req.body;
    if(refreshToken && accessToken){
      const decodedRefreshToken = jwt.verify(refreshToken,"refreshToken")
        const decodedAccessToken = jwt.verify(accessToken,"accessToken", { ignoreExpiration: true })
        if (decodedAccessToken.userId !== decodedRefreshToken.userId) {
          res.status(401).json({status:"failed",error:"UNAUTHORIZED"});
        }else{
          let newAccessToken = jwt.sign({
            userId: decodedAccessToken.userId
        }, "accessToken", {
            expiresIn: 3600
        });
         res.status(200).json({accessToken: newAccessToken})
        }
        
    }else{
      res.status(401).json({status:"failed",error:"INVALID REFRESH TOKEN"});
    }
  }catch (error) {
    res.status(500).json({ status: "failed", error });
  }
}
