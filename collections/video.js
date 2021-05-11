const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    require: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  tag: {
    type: Array,
    require: true,
  },
  cDate: {
    type: Date,
    required: true,
  },
  mDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  adSetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "adset",
  },
});

const Video = mongoose.model("video", videoSchema);

module.exports = Video;
