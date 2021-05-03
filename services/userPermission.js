const UserPerm = require("../collections/userPermission");
const basicCRUDGenerator = require("./basicCRUD");
const getUserPermissions = require("../utils/getUserPermissions");
const UserPermCRUD = basicCRUDGenerator(UserPerm);

function getBySubuserId(userId) {
  return getUserPermissions(
    { user: userId },
    { path: "zone", select: "_id name" },
    { path: "permissionGroup", select: "_id name" }
  );
}

function getByPermissionGroupId(permGroupId) {
  return getUserPermissions(
    { permissionGroup: permGroupId },
    { path: "zone", select: "_id name" },
    { path: "user", select: "_id username" }
  );
}

function getByZoneId(zoneId) {
  return getUserPermissions(
    { zone: zoneId },
    { path: "user", select: "_id username" },
    { path: "permissionGroup", select: "_id name" }
  );
}
function insertMany(objects) {
  return new Promise((resolve, reject) => {
    UserPerm.insertMany(objects, (error, documents) => {
      if (error) return reject(error);
      return resolve(documents);
    });
  });
}
module.exports = {
  ...UserPermCRUD,
  getBySubuserId,
  getByZoneId,
  getByPermissionGroupId,
  insertMany,
};
