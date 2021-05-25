const config = require("../config/config");
const UserPermService = require("./../services/userPermission");
async function insert(req, res) {
  try {
    const { user, permissionGroup, zone } = req.body;
    const newDocument = UserPermService.createModel({
      user,
      permissionGroup,
      zone,
      adminId: req.userId,
    });
    // console.log(newDocument);
    await UserPermService.insert(newDocument);
    return res
      .status(config.status_code.OK)
      .send({ userPermission: newDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function insertMany(req, res) {
  try {
    const { user, permissionGroups, zone } = req.body;
    const newDocuments = [];
    permissionGroups.forEach((pg) =>
      newDocuments.push({
        user,
        zone,
        permissionGroup: pg,
        adminId: req.userId,
      })
    );
    const insertedDocuments = await UserPermService.insertMany(newDocuments);
    return res
      .status(config.status_code.OK)
      .send({ userPermissions: insertedDocuments });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteManyByPermGroups(req, res) {
  try {
    const { user, permissionGroups, zone } = req.body;
    const result = await UserPermService.deleteBy({
      user,
      permissionGroup: { $in: permissionGroups },
      zone,
    });
    return res.status(config.status_code.OK).send({ userPermissions: result });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteByZone(req, res) {
  try {
    const { user, zone } = req.body;
    const result = await UserPermService.deleteBy({
      user,
      zone,
    });
    return res.status(config.status_code.OK).send({ userPermissions: result });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

function getBy(service) {
  return async function (req, res) {
    try {
      const { id } = req.params;
      const documents = await service(id);
      return res
        .status(config.status_code.OK)
        .send({ userPermissions: documents });
    } catch (error) {
      console.log(error);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error });
    }
  };
}

// async function getBySubuserId(req, res) {
//   try {
//     const { id } = req.params;
//     const document = await UserService.getUserById(id);
//     console.log("lalala:", document);

//     const userPermissions = await document["zonePermissionGroups"];
//     console.log("userPermissions", userPermissions);
//     return res.status(config.status_code.OK).send({ userPermissions });
//   } catch (error) {
//     console.log(error);
//     return res.status(config.status_code.SERVER_ERROR).send({ message: error });
//   }
// }
const getBySubuserId = getBy(UserPermService.getBySubuserId);
const getByPermissionGroupId = getBy(UserPermService.getByPermissionGroupId);
const getByZoneId = getBy(UserPermService.getByZoneId);

module.exports = {
  getBySubuserId,
  getByZoneId,
  getByPermissionGroupId,
  insert,
  insertMany,
  deleteManyByPermGroups,
  deleteByZone,
};
