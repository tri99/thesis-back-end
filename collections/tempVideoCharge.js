const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tempVideoChargeSchema = new Schema({
  videoId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "video",
  },
  zoneId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "zone",
  },
  deviceId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "device",
  },
  adOfferId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "adoffer",
  },
  timeStamp: {
    type: Number,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  moneyCharge: {
    type: Number,
    require: true,
  },
});

const tempVideoCharge = mongoose.model(
  "tempvideocharge",
  tempVideoChargeSchema
);

module.exports = tempVideoCharge;
