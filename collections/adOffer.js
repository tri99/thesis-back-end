const mongoose = require("mongoose");

const schema = mongoose.Schema;

const adOfferSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  adSetId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "adset",
  },
  bdManagerId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "user",
  },
  zoneIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "zone",
    },
  ],
  contentId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "playlist",
  },
  budget: {
    type: Number,
    require: true,
  },
  remainingBudget: {
    type: Number,
    required: true,
  },
  adManagerId: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "user",
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
