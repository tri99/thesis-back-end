const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportVideoLogSchema = new Schema({
  adOfferId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "adoffer",
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  bdManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "user",
  },
  videoId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "video",
  },
  zoneId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "zone",
  },
  deviceId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "device",
  },
  timeStart: {
    type: Number,
    required: true,
  },
  runTime: {
    type: Number,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  ages: {
    type: [Number],
    required: true,
  },
  genders: {
    type: [Number],
    required: true,
  },
  raw: {
    type: Object,
    required: true,
  },
  imagePath: {
    type: String,
  },
  moneyCharge: {
    type: Number,
  },
});

const reportVideoLog = mongoose.model("reportVideoLog", reportVideoLogSchema);

module.exports = reportVideoLog;
