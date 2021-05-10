const mongoose = require("mongoose");

const schema = mongoose.Schema;

const adOfferSchema = new schema({
  adSetId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  bdManagerId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  contentId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  budget: {
    type: Number,
    require: true,
  },
  remaingBudget: {
    type: Number,
    required: true,
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  timeDeploy: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  timeStatus: {
    type: Date,
    require: true,
  },
});

const adOffer = mongoose.model("adoffer", adOfferSchema);

module.exports = adOffer;
