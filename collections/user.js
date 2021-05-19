const mongoose = require("mongoose");
const getUserPermissions = require("../utils/getUserPermissions");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (e) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(e).toLowerCase());
      },
      message: (props) => `${props.value} is not a valid Email!`,
    },
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (p) {
        return p.length >= 8;
      },
      message: () => `your password is not long enough, 8 or more plzz`,
    },
  },
  adminId: Schema.Types.ObjectId,
  generalZoneId: Schema.Types.ObjectId,
  typeUser: {
    type: String,
    required: true,
  },
});

// function getBySubuserId(userId) {
//   return getUserPermissions(
//     { user: userId },
//     { path: "zone", select: "_id name" },
//     { path: "permissionGroup", select: "_id name" }
//   );
// }

// function getByPermissionGroupId(permGroupId) {
//   return getUserPermissions(
//     { permissionGroup: permGroupId },
//     { path: "zone", select: "_id name" },
//     { path: "user", select: "_id username" }
//   );
// }

// function getByZoneId(zoneId) {
//   return getUserPermissions(
//     { zone: zoneId },
//     { path: "user", select: "_id username" },
//     { path: "permissionGroup", select: "_id name" }
//   );
// }

userSchema.virtual("zonePermissionGroups").get(function () {
  return getUserPermissions(
    { user: this._id },
    { path: "zone", select: "_id name" },
    { path: "permissionGroup", select: "_id name permissions" }
  );
});
const User = mongoose.model("user", userSchema);
module.exports = User;
