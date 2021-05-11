const adOfferService = require("./../services/adOffer");
const adSetService = require("./../services/adSet");
const userService = require("./../services/user");
const config = require("./../config/config");
async function insert(req, res) {
  try {
    const {
      bdManagerId,
      contentId,
      budget,
      age,
      gender,
      dateOfWeek,
      hourOfDate,
    } = req.body;

    let doc = userService.getUserById(req.userId);
    if (doc["typeUser"] != "adManager")
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    const newAdSetDoc = adSetService.createModel({
      age,
      gender,
      dateOfWeek,
      hourOfDate,
      adManagerId: req.userId,
    });
    await adSetService.insert(newAdSetDoc);

    const newDocument = adOfferService.createModel({
      adSetId: newAdSetDoc._id,
      bdManagerId,
      contentId,
      budget,
      remaingBudget: budget,
      adManagerId: req.userId,
      timeDeploy: new Date().getTime(),
      status: "pending",
      timeStatus: new Date().getTime(),
    });
    await adOfferService.insert(newDocument);
    return res.status(config.status_code.OK).send({ adSet: newDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const document = await adOfferService.getAll();
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const document = await adOfferService.getById(id);
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getFullInfor(req, res) {
  try {
    const { id } = req.params;
    const document = await adOfferService.getFullInfor(id);
    return res.status(config.status_code.OK).send({ adOffers: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByAdManagerId(req, res) {
  try {
    const adManagerId = req.userId;
    const document = await adOfferService.findByPipeLine(
      {
        adManagerId: adManagerId,
      },
      {}
    );
    return res.status(config.status_code.OK).send({ adOffers: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByBdManagerId(req, res) {
  try {
    const bdManagerId = req.userId;
    console.log(bdManagerId);
    const document = await adOfferService.findByPipeLine(
      {
        bdManagerId: bdManagerId,
      },
      {}
    );
    return res.status(config.status_code.OK).send({ adOffers: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateStatusById(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let timeStatus = new Date();
    let document = adOfferService.getById(id);
    if (document["bdManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    }
    await adOfferService.updateById(id, {
      status,
      timeStatus,
    });
    document = adOfferService.getById(id);
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function CancelOfferById(req, res) {
  try {
    const { id } = req.params;
    let timeStatus = new Date();
    let document = adOfferService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    }
    await adOfferService.updateById(id, {
      status: "canceled",
      timeStatus,
    });
    document = adOfferService.getById(id);
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateAdsetOFAdOffer(req, res) {
  try {
    const { id } = req.params;
    const { age, gender, dateOfWeek, hourOfDate } = req.body;
    let document = adOfferService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.updateById(document.adSetId, {
      age,
      gender,
      dateOfWeek,
      hourOfDate,
    });
    document = await adOfferService.getFullInfor(id);
    return res.status(config.status_code.OK).send({ adSet: document });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    const { adSetId, bdManagerId, contentId, budget, remaingBudget } = req.body;
    let document = adOfferService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }

    await adOfferService.updateById(id, {
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remaingBudget,
    });
    document = adOfferService.getById(id);
    return res.status(config.status_code.OK).send({ adSet: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    let document = adOfferService.getById(id);
    if (document["adManagerId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.deleteById(document.adSetId);
    await adOfferService.deleteById(id);
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
  getFullInfor,
  getByAdManagerId,
  getByBdManagerId,
  updateById,
  updateStatusById,
  updateAdsetOFAdOffer,
  CancelOfferById,
  deleteById,
};
