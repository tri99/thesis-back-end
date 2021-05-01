const SubuserService = require("./../services/subuser");

const config = require("./../config/config");

async function getAll(req, res) {
  try {
    const subuserDocuments = await SubuserService.getAll(req.userId);

    return res.status(200).send({ subusers: subuserDocuments });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const userId = req.params.id;
    await SubuserService.deleteById(userId);
    return res.status(config.status_code.OK).send({ subuser: true });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}
module.exports = {
  getAll,
  deleteById,
};
