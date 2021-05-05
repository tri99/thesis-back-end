const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const permissionGroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  permissions: [Number],
  desc: String,
  adminId: Schema.Types.ObjectId,
});

var permissionGroup = mongoose.model("permissionGroup", permissionGroupSchema);
module.exports = permissionGroup;
