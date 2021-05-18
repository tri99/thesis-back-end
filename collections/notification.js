const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  cTime: {
    type: Date,
    required: true,
  },
  link: String,
});

const Notification = mongoose.model("notification", notificationSchema);

module.exports = Notification;
