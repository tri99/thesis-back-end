const UserPerm = require("../collections/userPermission");
const config = require("../config/config");
async function checkPermission(req, { permission, zone }) {
  const subuserId = req.subuserId;
  if (!subuserId) return false;
  try {
    const findObject = zone ? { user: subuserId, zone } : { user: subuserId };
    const userPerms = await UserPerm.find(findObject).populate({
      path: "permissionGroup",
      select: "permissions",
    });

    // console.log("uper", userPerms);
    const permGroups = userPerms.map((up) => up.permissionGroup.permissions);
    // console.log("permgroups", permGroups);
    for (const pg of permGroups) {
      if (pg.includes(permission)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

function authorization(permission, getZone) {
  return async (req, res, next) => {
    if (!req.subuserId) return next();
    const zone = getZone ? await getZone(req, res) : null;
    if (!(await checkPermission(req, { permission, zone })))
      return res.status(403).send({
        message: config.status_message.NOT_PERMISSION,
      });
    return next();
  };
}
module.exports = authorization;
