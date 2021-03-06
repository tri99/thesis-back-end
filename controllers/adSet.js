const adSetService = require("./../services/adSet");
const config = require("./../config/config");
const adSetSupport = require("./../utils/getAdSetStatus");

async function insert(req, res) {
  try {
    const { name, daysOfWeek, hoursOfDay } = req.body;
    const newDocument = adSetService.createModel({
      name,
      ages: { value: [], strict: false },
      genders: { value: [], strict: false },
      daysOfWeek,
      hoursOfDay,
      adManagerId: req.userId,
      isMedia: false,
    });
    await adSetService.insert(newDocument);
    return res.status(config.status_code.OK).send({ adset: newDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const document = await adSetService.getAll();
    return res.status(config.status_code.OK).send({ adsets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAllNotMedia(req, res) {
  try {
    const document = await adSetService.getAll({
      adManagerId: req.userId,
      isMedia: false,
    });
    return res.status(config.status_code.OK).send({ adsets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const document = await adSetService.getById(id);
    return res.status(config.status_code.OK).send({ adset: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByAdManagerId(req, res) {
  try {
    const { id } = req.params;
    const document = await adSetService.findByPipeLine({
      adManagerId: id,
      isMedia: false,
    });
    return res.status(config.status_code.OK).send({ adsets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    const { daysOfWeek, hoursOfDay } = req.body;
    let document = await adSetService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    let { result, adOfferDoc } = await adSetSupport.getAdSetStatus(id);
    if (result === false) {
      return res.status(config.status_code.FORBIDEN).send({
        message: "Some active ads are using this setting",
        adOffers: adOfferDoc,
      });
    }
    await adSetService.updateById(id, {
      daysOfWeek,
      hoursOfDay,
    });
    document = await adSetService.getById(id);
    return res.status(config.status_code.OK).send({ adset: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    let document = await adSetService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    let { result, adOfferDoc } = await adSetSupport.getAdSetStatus(id);
    if (result === false) {
      return res.status(config.status_code.FORBIDEN).send({
        message: "Some active ads are using this setting",
        adOffers: adOfferDoc,
      });
    }
    await adSetService.deleteById(id);
    return res.status(config.status_code.OK).send({ adset: true });
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
  getAllNotMedia,
  updateById,
  deleteById,
};
