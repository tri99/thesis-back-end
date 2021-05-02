const config = require("../config/config");
const permGroupService = require("../services/permissionGroup");

/**
 *  @param {String} name
 */

async function insert(req, res) {
  try {
    const { name, permissions, desc } = req.body;
    const newDocument = permGroupService.createModel({
      name,
      permissions,
      desc,
      adminId: req.userId,
    });
    console.log(newDocument);
    await permGroupService.insert(newDocument);
    return res.status(config.status_code.OK).send({ permGroup: newDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    let { name, permissions, desc } = req.body;

    await permGroupService.updateById(id, { name, permissions, desc });

    let document = await permGroupService.getById(id);

    return res.status(config.status_code.OK).send({ permGroup: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *  @param {String} id
 */

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    await permGroupService.deleteById(id);

    return res.status(config.status_code.OK).send({ permGroup: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

/**
 *  @param {String} id
 */

async function getById(req, res) {
  try {
    const { id } = req.params;
    const document = await permGroupService.getById(id);
    return res.status(config.status_code.OK).send({ permGroup: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const documents = await permGroupService.getAll({ adminId: req.userId });
    return res.status(config.status_code.OK).send({ permGroups: documents });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert,
  getById,
  getAll,
  deleteById,
  updateById,
};
