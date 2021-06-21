const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const zoneSchema = new Schema({
  videoArray: {
    type: Array,
    require: true,
  },
  playlistArray: {
    type: Array,
    required: true,
  },
  deviceArray: [
    {
      type: mongoose.Types.ObjectId,
      ref: "device",
    },
  ],
  name: {
    type: String,
    required: true,
  },
  volumeVideo: {
    type: Number,
    require: true,
  },
  isMuteVideo: {
    type: Boolean,
    required: true,
  },
  isLoopOneVideo: {
    type: Boolean,
    required: true,
  },
  isLoopAllVideo: {
    type: Boolean,
    required: true,
  },
  location: {
    type: { lat: Number, lng: Number },
    required: true,
  },
  locationDesc: {
    type: String,
    required: true,
  },
  pricePerTimePeriod: {
    type: Number,
    required: true,
  },
  priceArray: {
    type: [{ price: Number, isGoldenTime: Boolean }],
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  adArray: [
    {
      type: mongoose.Types.ObjectId,
      ref: "adoffer",
    },
  ],
  formula: {
    type: String,
    require: true,
  },
});

const Zone = mongoose.model("zone", zoneSchema);

module.exports = Zone;
