const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userPermZoneSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  permissionGroup: {
    type: Schema.Types.ObjectId,
    ref: "permissionGroup",
    required: true,
  },
  zone: {
    type: Schema.Types.ObjectId,
    ref: "zone",
    required: true,
  },
  adminId: Schema.Types.ObjectId,
});

var userPermZone = mongoose.model("userPermZone", userPermZoneSchema);
module.exports = userPermZone;
