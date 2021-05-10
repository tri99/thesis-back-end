const adOfferService = require("./../services/adOffer");
const config = require("./../config/config");

async function insert(req, res) {
  try {
    const { adSetId, bdManagerId, contentId, budget } = req.body;
    const newDocument = adOfferService.createModel({
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remaingBudget: budget,
      adManagerId: req.userId,
      timeDeploy: new Date().getTime(),
      status: "pending",
      timeStatus: new Date().getTime(),
    });
    await adOfferService.insert(adOfferService);
    return res.status(config.status_code.OK).send({ adSet: newDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const document = await adOfferService.getAll();
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const document = await adOfferService.getById(req.userId);
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByAdManagerId(req, res) {
  try {
    const { id } = req.params;
    const document = adOfferService.findByPipeLine({ adManagerId: id });
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByBdManagerId(req, res) {
  try {
    const { id } = req.params;
    const document = adOfferService.findByPipeLine({ bdManagerId: id });
    return res.status(config.status_code.OK).send({ adSets: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateStatusById(req, res) {
  try {
    const { _id, status, timeStatus } = req.body;
    let document = adOfferService.getById(_id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adOfferService.updateById(_id, {
      status,
      timeStatus,
    });
    document = adOfferService.getById(_id);
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const {
      _id,
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remaingBudget,
    } = req.body;
    let document = adOfferService.getById(_id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adOfferService.updateById(_id, {
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remaingBudget,
    });
    document = adOfferService.getById(_id);
    return res.status(config.status_code.OK).send({ adSet: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { _id } = req.params;
    let document = adOfferService.getById(_id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adOfferService.deleteById(_id);
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
  getByBdManagerId,
  updateById,
  updateStatusById,
  deleteById,
};
