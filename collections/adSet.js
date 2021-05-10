const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adSetSchema = new Schema({
  age: {
    type: [],
    require: true,
  },
  gender: {
    type: [],
    require: true,
  },
  dateOfWeek: {
    type: [],
    require: true,
  },
  hourOfDay: {
    type: [],
    require: true,
  },
  mediaId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

var AdSet = mongoose.model("adset", adSetSchema);

module.exports = AdSet;
