const adSetService = require("./../services/adSet");
const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { age, gender, dateOfWeek, hourOfDate } = req.body;
    const newDocument = adSetService.createModel({
      age,
      gender,
      dateOfWeek,
      hourOfDate,
      adManagerId: req.userId,
    });
    await adSetService.insert(newDocument);
    return res.status(config.status_code.OK).send({ adSet: newDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const document = await adSetService.getAll();
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const document = await adSetService.getById(req.userId);
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByAdManagerId(req, res) {
  try {
    const { id } = req.params;
    const document = adSetService.findByPipeLine({ adManagerId: id });
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { _id, age, gender, dateOfWeek, hourOfDate } = req.body;
    let document = adSetService.getById(_id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.updateById(_id, {
      age,
      gender,
      dateOfWeek,
      hourOfDate,
    });
    document = adSetService.getById(_id);
    return res.status(config.status_code.OK).send({ adSet: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { _id } = req.params;
    let document = adSetService.getById(_id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.deleteById(_id);
    return res.status(config.status_code.OK).send({ adSet: true });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  insert,
  getAll,
  getById,
  getByAdManagerId,
  updateById,
  deleteById,
};
