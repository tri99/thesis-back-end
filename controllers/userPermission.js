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
    console.log(newDocument);
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
    console.log("insertMany:", await UserPermService.insertMany(newDocuments));
    return res
      .status(config.status_code.OK)
      .send({ userPermissions: newDocuments });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}
async function getBySubuserId(req, res) {
  try {
    const { id } = req.params;
    const documents = await UserPermService.getBySubuserId(id);
    return res
      .status(config.status_code.OK)
      .send({ userPermissions: documents });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  getBySubuserId,
  insert,
  insertMany,
};
