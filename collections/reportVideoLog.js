const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportVideoLogSchema = new Schema({
  userId: {
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
  processArray: {
    type: [],
    required: true,
  },
});

const reportVideoLog = mongoose.model("reportVideoLog", reportVideoLogSchema);

module.exports = reportVideoLog;
