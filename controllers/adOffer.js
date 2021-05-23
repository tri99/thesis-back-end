const adOfferService = require("./../services/adOffer");
const adSetService = require("./../services/adSet");
const userService = require("./../services/user");
const NotificationService = require("./../services/notification");
const config = require("./../config/config");
const socketService = require("../socket");
function isBelongToUserFindOption(userId) {
  return {
    $or: [
      {
        bdManagerId: userId,
        deletedByBdManager: false,
        status: { $ne: "idle" },
      },
      { adManagerId: userId, deletedByAdManager: false },
    ],
  };
}

function isBelongToAdManager(document, userId) {
  return (
    document["adManagerId"].toString() === userId &&
    !document["deletedByAdManager"]
  );
}

function isBelongToBdManager(document, userId) {
  return (
    document["bdManagerId"].toString() === userId &&
    !document["deletedByBdManager"]
  );
}
async function insert(req, res) {
  try {
    const { name, bdManagerId, contentId, budget, adSetId, zoneIds } = req.body;

    let doc = await userService.getUserById(req.userId);
    let doc2 = await adOfferService.findByPipeLine({ adSetId: adSetId });
    if (doc["typeUser"].toString() != "adManager")
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });

    for (let i = 0; i < doc2; i++) {
      if (
        doc2[i]["contentId"].toString() == contentId &&
        doc2[i]["adSetId"].toString() == adSetId &&
        (doc2[i]["status"].toString() != "rejected" ||
          doc2[i]["status"].toString() != "canceled")
      )
        return res
          .status(config.status_code.FORBIDEN)
          .send({ message: "adOffer with the same adSet and content existed" });
    }

    const newDocument = adOfferService.createModel({
      name,
      adSetId,
      bdManagerId,
      contentId,
      zoneIds,
      budget,
      remainingBudget: budget,
      adManagerId: req.userId,
      timeDeploy: new Date().getTime(),
      status: "idle",
      timeStatus: new Date().getTime(),
      deletedByAdManager: false,
      deletedByBdManager: false,
    });
    await adOfferService.insert(newDocument);

    return res.status(config.status_code.OK).send({ adOffer: newDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function sendOfferById(req, res) {
  try {
    const { id } = req.params;
    let timeStatus = new Date();
    let document = await adOfferService.getById(id);
    if (!isBelongToAdManager(document, req.userId)) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    }
    let user = await userService.getUserById(req.userId);
    await adOfferService.updateById(id, {
      status: "pending",
      timeStatus,
    });
    document = await adOfferService.getById(id);
    await NotificationService.insertNotification(
      `You received an ad offer **${document["name"]}** from **${user["username"]}**`,
      document["bdManagerId"],
      {
        type: "info",
        link: `/buildingads/${document["_id"].toString()}`,
      }
    );
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function redeployOfferById(req, res) {
  try {
    const { id } = req.params;
    const { budget } = req.body;
    let timeStatus = new Date();
    let document = await adOfferService.getById(id);
    if (!isBelongToAdManager(document, req.userId)) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    } else if (budget <= 0) {
      return res
        .status(config.status_code.WRONG)
        .send({ message: "New budget has to be larger than 0" });
    } else if (document["status"] !== "empty") {
      return res.status(config.status_code.WRONG).send({
        message: "Your ad has been canceled or doesnt have an empty status",
      });
    }
    let user = await userService.getUserById(req.userId);
    await adOfferService.updateById(id, {
      status: "deployed",
      timeStatus,
      budget: document["budget"] + budget,
    });
    document = await adOfferService.getById(id);
    await NotificationService.insertNotification(
      `Ad **${document["name"]}** from **${user["username"]}** has been redeployed`,
      document["bdManagerId"],
      {
        type: "info",
        link: `/buildingads/${document["_id"].toString()}`,
      }
    );
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const document = await adOfferService.getAll(
      isBelongToUserFindOption(req.userId)
    );
    return res.status(config.status_code.OK).send({ adOffers: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params;
    const document = await adOfferService.findBy(
      {
        _id: id,
        ...isBelongToUserFindOption(req.userId),
      },
      { isFindOne: true }
    );
    if (!document) {
      return res
        .status(config.status_code.NOT_FOUND)
        .send({ message: "NOT FOUND" });
    }
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getFullInfor(req, res) {
  try {
    const { id } = req.params;
    const document = await adOfferService.getFullInfor({
      _id: id,
      ...isBelongToUserFindOption(req.userId),
    });
    if (!document) {
      return res
        .status(config.status_code.NOT_FOUND)
        .send({ message: "NOT FOUND" });
    }
    return res.status(config.status_code.OK).send({ adOffer: document });
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
        deletedByAdManager: false,
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
    const document = await adOfferService.findByPipeLine(
      {
        bdManagerId: bdManagerId,
        deletedByBdManager: false,
        status: { $ne: "idle" },
      },
      {}
    );
    return res.status(config.status_code.OK).send({ adOffers: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByArrayStatus(req, res) {
  try {
    const { statuses } = req.query;
    let doc = await userService.getUserById(req.userId);
    let query = {};
    if (doc["typeUser"] == "adManager")
      query = { adManagerId: req.userId, status: { $in: { statuses } } };
    if (doc["typeUser"] == "bdManager")
      query = { bdManagerId: req.userId, status: { $in: { statuses } } };
    const document = await adOfferService.findByPipeLine(query, {});
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
    let document = await adOfferService.getById(id);
    if (!isBelongToBdManager(document, req.userId)) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    }
    await adOfferService.updateById(id, {
      status,
      timeStatus,
    });

    document = await adOfferService.getById(id);
    const isDeployed = document["status"] === "deployed";
    await NotificationService.insertNotification(
      `Your ad offer **${document["name"]}** has been **${
        isDeployed ? "deployed" : "rejected"
      }**`,
      document["adManagerId"],
      {
        type: isDeployed ? "success" : "warn",
        link: `/ads/${document["_id"].toString()}`,
      }
    );
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function CancelOfferById(req, res) {
  try {
    const { id } = req.params;
    let timeStatus = new Date();
    let document = await adOfferService.getById(id);
    const isAdManager = isBelongToAdManager(document, req.userId);
    const isBdManager = isBelongToBdManager(document, req.userId);
    const status = document["status"];
    const isPending = status === "pending";
    const isNonPending = status === "deployed" || status === "empty";
    const isCancelable =
      (isAdManager && (isPending || isNonPending)) ||
      (isBdManager && isNonPending);
    if (!isCancelable) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    }
    const newStatus = isAdManager
      ? isPending
        ? "idle"
        : "finished"
      : "finished";
    await adOfferService.updateById(id, {
      status: newStatus,
      timeStatus,
    });
    document = await adOfferService.getById(id);
    await NotificationService.insertNotification(
      `Your ${isPending ? "pending ad offer" : "ad"}  **${
        document["name"]
      }** has been **canceled**`,
      isAdManager ? document["bdManagerId"] : document["adManagerId"],
      {
        type: "warn",
        link: `/${isAdManager ? "buildingads" : "ads"}/${document[
          "_id"
        ].toString()}`,
      }
    );

    if (isAdManager && isPending) {
      socketService
        .getIO()
        .in(document["bdManagerId"].toString())
        .emit("cancel-pending-offer", { id });
    }
    return res.status(config.status_code.OK).send({ status: newStatus });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateAdsetOFAdOffer(req, res) {
  try {
    const { id } = req.params;
    const { ages, genders, daysOfWeek, hoursOfDay } = req.body;
    let document = await adOfferService.getById(id);
    if (!isBelongToAdManager(document, req.userId)) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await adSetService.updateById(document.adSetId, {
      ages,
      genders,
      daysOfWeek,
      hoursOfDay,
    });
    document = await adOfferService.getFullInfor(id);
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remainingBudget,
      zoneIds,
    } = req.body;
    let document = await adOfferService.getById(id);
    if (!isBelongToAdManager(document, req.userId)) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    if (document["status"] !== "idle") {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "You can only edit an idle ad" });
    }
    await adOfferService.updateById(id, {
      name,
      adSetId,
      bdManagerId,
      contentId,
      budget,
      remainingBudget,
      zoneIds,
    });
    document = await adOfferService.getById(id);
    return res.status(config.status_code.OK).send({ adOffer: document });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;
    let document = await adOfferService.getById(id);
    const isAdManager = isBelongToAdManager(document, req.userId);
    const isBdManager = isBelongToBdManager(document, req.userId);
    if (!isAdManager && !isBdManager) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "You don't have permission to delete this" });
    } else if (
      document["status"] !== "idle" &&
      document["status"] !== "finished"
    ) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "Can only delete a idle or finished ad" });
    }
    // await adSetService.deleteById(document.adSetId);
    if (isAdManager) {
      document["status"] !== "idle"
        ? await adOfferService.updateById(id, { deletedByAdManager: true })
        : await adOfferService.deleteById(id);
    } else if (isBdManager) {
      await adOfferService.updateById(id, { deletedByBdManager: true });
    }
    // } else {
    //   await adOfferService.deleteById(id);
    // }

    return res.status(config.status_code.OK).send({ adOffer: true });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

// async function chargeMoney(req, res) {
//   try {
//     const { adOfferId, videoId, moneyCharge, zoneId, runtime } = req.body;

//     let adOfferDoc = await adOfferService.getById(adOfferId);
//   } catch (error) {}
// }

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
  sendOfferById,
  deleteById,
  getByArrayStatus,
  redeployOfferById,
};
