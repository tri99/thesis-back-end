const config = require("./../config/config");
const adOfferService = require("./../services/adOffer");
const zoneService = require("./../services/zone-ver2");
const userService = require("./../services/user");
// const videoService = require("./../services/video");
const deviceService = require("./../services/device");
// const playlistService = require("./../services/playlist");
const audio_module = require("./../exports/audio-io");
const mongoose = require("mongoose");
const zoneSupport = require("./../utils/convertZoneDataForDevice");
const reportVideoLogService = require("./../services/reportVideoLog");
const dayjs = require("dayjs");
// const handle = require("./../utils/handle");
async function insert(req, res) {
  try {
    const {
      name,
      location,
      locationDesc,
      pricePerTimePeriod,
      priceArray,
    } = req.body;
    // console.log(req.body);
    if (name.toLowerCase() === "General") {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "'general' is a reserved name" });
    }
    const videoArray = [];
    const playlistArray = [];
    const deviceArray = [];
    const volumeVideo = 0;
    const newZoneDocument = zoneService.createModel({
      videoArray,
      playlistArray,
      deviceArray,
      name,
      volumeVideo,
      isMuteVideo: false,
      isLoopOneVideo: false,
      isLoopAllVideo: false,
      userId: req.userId,
      adArray: [],
      adArraySet: [],
      location,
      locationDesc,
      pricePerTimePeriod,
      priceArray,
      formula: "",
    });
    const insertedZone = await zoneService.insert(newZoneDocument);
    return res.status(config.status_code.OK).send({ zone: insertedZone });
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
    let zoneDocument = await zoneService.getById(id);
    if (zoneDocument["userId"].toString() != req.userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    // console.log(zoneDocument.adArray);
    if (zoneDocument.adArray.length > 0) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "Can't delete zone with ads" });
    }
    let deviceDocument = await deviceService.getManyByArrayId(
      zoneDocument["deviceArray"]
    );
    for (let i = 0; i < deviceDocument.length; i++) {
      deviceDocument[i]["zoneId"] = null;
      await deviceService.insert(deviceDocument[i]);
    }
    await zoneService.deleteById(id);

    return res.status(config.status_code.OK).send({ zone: true });
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
    const newZoneDocument = await zoneService.getByIdwithAdName(id);
    const deviceDocument = await deviceService.getManyByArrayId(
      newZoneDocument["deviceArray"]
    );
    newZoneDocument["deviceArray"] = deviceDocument;
    return res.status(config.status_code.OK).send({ zone: newZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAll(req, res) {
  try {
    const ZoneDocument = await zoneService.getAll();
    return res.status(config.status_code.OK).send({ zones: ZoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getByIdforDevice(req, res) {
  try {
    const { zoneId } = req.body;
    let ZoneDocument = await zoneService.getById(zoneId);
    if (!ZoneDocument)
      ZoneDocument = {
        videoArray: [],
        playlistArray: [],
        name: "",
        volumeVideo: 50,
        isMuteVideo: false,
        isLoopOneVideo: false,
        isLoopAllVideo: false,
        adArray: [],
        adArraySet: [],
      };
    let doc = await zoneSupport.convertZoneData(ZoneDocument);
    return res.status(config.status_code.OK).send({ zone: doc });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getZoneByDeviceId(req, res) {
  try {
    const { deviceId } = req.body;
    let zoneDocument = await zoneService.findByPipeLine(
      {
        deviceArray: { $in: [mongoose.Types.ObjectId(deviceId)] },
      },
      {}
    );
    let doc = await zoneSupport.convertZoneData(zoneDocument);
    return res.status(config.status_code.OK).send({ zone: doc });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function removeDeviceFromZone(req, res) {
  try {
    const { zoneId, deviceId } = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let deviceDocument = await deviceService.getById(deviceId);
    if (!deviceDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device not found" });

    if (!zoneDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "zone not found" });

    if (!zoneDocument["deviceArray"].includes(deviceDocument["_id"]))
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device was not added" });

    deviceDocument["zoneId"] = null;
    zoneDocument["deviceArray"] = zoneDocument["deviceArray"].filter(
      (device) => {
        return !device.equals(deviceDocument["_id"]);
      }
    );
    await deviceService.insert(deviceDocument);
    await zoneService.insert(zoneDocument);
    audio_module.get_audio_io().to(deviceId).emit("remove-device-in-zone", "");
    return res
      .status(config.status_code.OK)
      .send({ deviceId: "deviceDocument" });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function addDeviceToZone(req, res) {
  try {
    const { zoneId, deviceId } = req.body;
    let zoneDocument = await zoneService.getById(zoneId);
    let deviceDocument = await deviceService.getById(deviceId);

    if (!deviceDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device not found" });

    if (!zoneDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "zone not found" });

    if (zoneDocument["deviceArray"].includes(deviceDocument["_id"]))
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "device was added" });

    deviceDocument["zoneId"] = zoneDocument["_id"];

    zoneDocument["deviceArray"].push(deviceDocument["_id"]);
    await deviceService.insert(deviceDocument);
    await zoneService.insert(zoneDocument);
    audio_module
      .get_audio_io()
      .to(deviceId)
      .emit("add-device-into-zone", { to: deviceId, zoneId: zoneId });
    const deviceRow = (
      await zoneService.getDeviceTable(zoneId, {
        deviceId: mongoose.Types.ObjectId(deviceId),
      })
    )[0] || {
      _id: deviceId,
      name: deviceDocument["name"],
      views: 0,
      avgViews: 0,
      cost: 0,
    };
    return res
      .status(config.status_code.OK)
      .send({ newDevice: deviceDocument, deviceRow });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getZoneByUserId(req, res) {
  try {
    const userId = req.userId;
    // console.log(videoIds);
    let zoneDocument = await zoneService.findByPipeLine(
      {
        userId: mongoose.Types.ObjectId(userId),
      },
      "_id name location locationDesc pricePerTimePeriod"
    );
    return res.status(config.status_code.OK).send({ zones: zoneDocument });
  } catch (error) {
    // console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function changeAdOfferToZone(req, res) {
  try {
    const zoneId = req.params.id;
    const { adArray } = req.body;
    let userDoc = await userService.getUserById(req.userId);
    let zoneDocument = await zoneService.getById(zoneId);
    if (
      userDoc["typeUser"].toString() != "bdManager" ||
      zoneDocument["userId"].toString() != req.userId
    )
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "NOT_PERMISSION" });
    zoneDocument["adArray"] = adArray;
    await zoneService.updateById(zoneId, {
      adArray: zoneDocument["adArray"],
    });
    zoneDocument = await zoneService.getById(zoneId);
    return res.status(config.status_code.OK).send({ zone: zoneDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateById(req, res) {
  try {
    const { id } = req.params;
    let userDoc = await userService.getUserById(req.userId);
    let zoneDocument = await zoneService.getById(id);
    if (
      userDoc["typeUser"].toString() != "bdManager" ||
      zoneDocument["userId"].toString() != req.userId
    ) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }

    let {
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo,
      adArray,
      location,
      locationDesc,
      pricePerTimePeriod,
      priceArray,
      formula,
    } = req.body;
    if (!priceArray || !zoneDocument.priceArray) {
      priceArray = [];
      zoneDocument.priceArray = [];
    }
    const isDiffPrice = zoneDocument.pricePerTimePeriod !== pricePerTimePeriod;
    const { lat, lng } = zoneDocument.location;
    const isDiffLocation = lat !== location.lat || lng !== location.lng;
    if (zoneDocument.adArray.length > 0 && (isDiffPrice || isDiffLocation)) {
      return res.status(config.status_code.FORBIDEN).send({
        message:
          "Zone still has ads so you can't change price or location value",
      });
    }
    zoneDocument = await zoneService.updateById(id, {
      name,
      volumeVideo,
      isMuteVideo,
      isLoopOneVideo,
      isLoopAllVideo,
      adArray,
      location,
      locationDesc,
      pricePerTimePeriod,
      priceArray,
      formula,
    });
    zoneDocument = await zoneService.getByIdwithAdName(id);

    audio_module.get_audio_io().to(id).emit("update-zone", { zoneId: id });

    return res.status(config.status_code.OK).send({ zone: zoneDocument });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getLogsByZoneId(req, res) {
  try {
    const today = dayjs();
    const yesterday = today.subtract(1, "d");
    const logs = await reportVideoLogService.findBy(
      {
        zoneId: req.params.id,
        timeStart: { $gte: yesterday.unix(), $lte: today.unix() },
      },
      {
        select: "_id videoId timeStart adOfferId",
        populate: [
          { path: "videoId", select: "name" },
          { path: "adOfferId", select: "_id name" },
          { path: "deviceId", select: "name" },
        ],
        sort: "-timeStart",
      }
    );
    return res.status(config.status_code.OK).send({ logs });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getDeviceTableByZoneId(req, res) {
  try {
    let zone = (
      await zoneService.findBy(
        { _id: req.params.id },
        { populate: { path: "deviceArray", select: "_id name" } }
      )
    )[0];
    const deviceIds = zone.deviceArray.map((dev) => dev._id);
    let devices = await zoneService.getDeviceTable(req.params.id, {
      deviceId: { $in: deviceIds },
    });
    devices = devices.map((device) => ({
      ...device,
      position: 0,
      volumeVideo: 50,
      isPause: true,
      isMute: false,
      deviceId: device._id,
    }));

    const deviceWithDataIds = devices.map((dev) => dev._id.toString());
    zone.deviceArray.forEach((device) => {
      if (!deviceWithDataIds.includes(device._id.toString())) {
        devices.push({
          ...device.toObject(),
          position: 0,
          volumeVideo: 50,
          isPause: true,
          isMute: false,
          deviceId: device._id,
          views: 0,
          avgViews: 0,
          cost: 0,
          numberOfTimes: 0,
          runTime: 0,
        });
      }
    });
    return res.status(config.status_code.OK).send({ devices });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAdOffersTableByZoneId(req, res) {
  try {
    const findOption = {
      bdManagerId: req.userId,
      zoneIds: req.params.id,
      deletedByBdManager: false,
      status: { $in: ["deployed", "empty"] },
    };
    // const userPopulate =
    //   type === "ad"
    //     ? { path: "bdManagerId", select: "_id username" }
    //     : { path: "adManagerId", select: "_id username" };
    const allAds = await adOfferService.findBy(findOption, {
      select: "_id name status timeStatus",
      // populate: [
      //   userPopulate,
      //   { path: "adSetId", select: "_id name" },
      //   { path: "contentId", select: "_id name" },
      // ],
      sort: "-timeStatus",
    });
    const allAdIds = allAds.map((ad) => ad._id);
    const tableData = await adOfferService.getTable(allAdIds, {
      zoneId: mongoose.Types.ObjectId(req.params.id),
    });
    let result = [];
    for (const ad of allAds) {
      const tableDataRow = tableData.find(
        (tableAd) => ad._id.toString() === tableAd._id.toString()
      );
      const adObject = ad.toObject();
      if (tableDataRow) {
        result.push({ ...tableDataRow, ...adObject });
      } else {
        result.push({
          views: 0,
          runTime: 0,
          cost: 0,
          avgViews: 0,
          avgRunTime: 0,
          ...adObject,
        });
      }
    }
    return res.status(config.status_code.OK).send({ adOffers: result });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getAllTable(req, res) {
  try {
    const allZones = await zoneService.findBy(
      { userId: req.userId, name: { $ne: "General" } },
      {
        select:
          "_id name location locationDesc pricePerTimePeriod adArray deviceArray priceArray",
      }
    );
    const allZoneIds = allZones.map((zone) => zone._id);
    const tableData = await zoneService.getTable(allZoneIds);
    let result = [];
    for (const zone of allZones) {
      const tableDataRow = tableData.find(
        (tableZone) => zone._id.toString() === tableZone._id.toString()
      );
      const zoneObject = zone.toObject();
      if (tableDataRow) {
        result.push({ ...tableDataRow, ...zoneObject });
      } else {
        result.push({
          views: 0,
          runTime: 0,
          cost: 0,
          avgViews: 0,
          avgRunTime: 0,
          ...zoneObject,
        });
      }
    }
    return res.status(config.status_code.OK).send({ zones: result });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}
module.exports = {
  insert,
  getAll,
  getAllTable,
  getById,
  getByIdforDevice,
  getZoneByDeviceId,
  getZoneByUserId,
  getLogsByZoneId,
  getDeviceTableByZoneId,
  getAdOffersTableByZoneId,
  deleteById,
  removeDeviceFromZone,
  addDeviceToZone,
  changeAdOfferToZone,
  updateById,
};
