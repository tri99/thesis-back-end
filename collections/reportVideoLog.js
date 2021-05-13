const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportVideoLogSchema = new Schema({
  adOfferId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  bdManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  videoId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  zoneId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  timeStart: {
    type: Number,
    required: true,
  },
  timeShow: {
    type: Number,
    required: true,
  },
  totalFaces: {
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
});

const reportVideoLog = mongoose.model("reportVideoLog", reportVideoLogSchema);

module.exports = reportVideoLog;
