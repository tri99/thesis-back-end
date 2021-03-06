const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adSetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ages: {
    type: {},
    require: true,
  },
  genders: {
    type: {},
    require: true,
  },
  daysOfWeek: {
    type: {},
    require: true,
  },
  hoursOfDay: {
    type: {},
    require: true,
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  isMedia: {
    type: Boolean,
    required: true,
  },
});

var AdSet = mongoose.model("adset", adSetSchema);

module.exports = AdSet;
