const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  zoneId: {
    type: Schema.Types.ObjectId,
    ref: "zone",
  },
  status: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
  },
  timeStatusChange: {
    type: Date,
    required: true,
  },
});

var device = mongoose.model("device", deviceSchema);
module.exports = device;
