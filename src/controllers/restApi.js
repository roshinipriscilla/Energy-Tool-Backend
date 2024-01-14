const users = require("../models/users");

exports.propertyCount= async(req,res)=>{
    try{
        let propertyCount=[];
        await users.distinct('propertyType').then(async data=>{
            for await (const temp of data){
                await users.countDocuments({propertyType:temp}).then(result=>{
                    propertyCount.push({[temp]:result})
                })
            }
            res.status(200).json({status:"success",propertyCount})
        }).catch(error=>{
        res.status(500).json({ status: "failed", error });
        })
    }catch (error) {
        res.status(500).json({ status: "failed", error });
      }
}

exports.getEnergyStatisticsByProperty = async(req,res)=>{
    try{
        let propertyType = req.params.propertyType;
        let noOfBedrooms = req.params.noOfBedrooms;
        let avgCostPerDay=0,count=0;
        users.find({propertyType:propertyType, numberOfBedrooms:noOfBedrooms}).select("readings").populate({path:"readings",match: { amountToBePaid: { $ne: "0" } },select: "avgCostPerDay"}).exec().then(data=>{
            data.forEach(temp=>{
                temp.readings.forEach(res=>{
                    avgCostPerDay=avgCostPerDay+res.avgCostPerDay
                    count++;
                })                
            })
            let result = {
                type: propertyType,
                bedroom:noOfBedrooms,
                average_electricity_gas_cost_per_day:(avgCostPerDay/count).toFixed(2),
                unit:"Pound"
            }
            res.status(200).json({status:"success",data:result})
        })
    }catch (error) {
        res.status(500).json({ status: "failed", error });
      }
}