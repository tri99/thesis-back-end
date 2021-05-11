const adSetService = require("./../services/adSet");
const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { ages, genders, daysOfWeek, hoursOfDate } = req.body;
    const newDocument = adSetService.createModel({
      ages,
      genders,
      daysOfWeek,
      hoursOfDate,
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
    const { id } = req.params;
    const document = await adSetService.getById(id);
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
    const { id } = req.params;
    const { ages, genders, daysOfWeek, hoursOfDate } = req.body;
    let document = adSetService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.updateById(id, {
      ages,
      genders,
      daysOfWeek,
      hoursOfDate,
    });
    document = adSetService.getById(id);
    return res.status(config.status_code.OK).send({ adSet: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    let document = adSetService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.deleteById(id);
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
