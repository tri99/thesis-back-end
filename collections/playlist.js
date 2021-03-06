const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  mediaArray: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  volume: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

const Playlist = mongoose.model("playlist", playlistSchema);

module.exports = Playlist;
