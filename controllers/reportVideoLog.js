const reportVideoLogService = require("./../services/reportVideoLog");
const adOfferService = require("../services/adOffer");
const userService = require("./../services/user");
const reportVideoLog = require("./../collections/reportVideoLog");
const tempVideoChargeService = require("./../services/tempVideoCharge");
const zoneService = require("./../services/zone-ver2");
const videoService = require("./../services/video");
const config = require("./../config/config");
const socketService = require("../socket");
const { getAgeTagName, getAgeTag } = require("../utils/ageGenders");
const handle = require("./../services/handle");
const dayjs = require("dayjs");
const nullTransform = require("../utils/nullTransform");
const {
  Types: { ObjectId },
} = require("mongoose");
const audio_module = require("./../exports/audio-io");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
async function getByUserId(req, res) {
  try {
    const userId = req.userId;
    const reportVideoLogDocument = await reportVideoLogService.getByOneParam(
      userId
    );
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}
function isSameTotal(dateStart, dateLog, frequency) {
  return (
    dateLog.isSameOrAfter(dateStart, "d") &&
    dateLog.isSameOrBefore(dateStart.add(frequency - 1, "d"), "d")
  );
}

function getNoDataPoint(timeStart, timeEnd, freq = 1) {
  return (
    Math.floor(
      (1.0 *
        dayjs.unix(timeEnd).hour(1).diff(dayjs.unix(timeStart).hour(0), "d")) /
        freq
    ) + 1
  );
}

function getByGenerator(populate, queryCheckCb) {
  return async function (req, res) {
    try {
      const userId = req.userId;
      let { value, frequency, timeStart, timeEnd, item } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const adFindOption = !item || item === "all" ? {} : { adOfferId: item };
      let dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
      const logsInPeriod = await reportVideoLog
        .find({
          adManagerId: userId,
          timeStart: {
            $gte: dateStart.unix(),
            $lte: dayjs.unix(timeEnd).hour(23).unix(),
          },
          ...adFindOption,
        })
        .sort("timeStart")
        .populate(populate);
      frequency = Number(frequency);
      const noDataPoints =
        Math.floor(
          (1.0 * dayjs.unix(timeEnd).hour(1).diff(dateStart, "d")) / frequency
        ) + 1;
      const dataMap = new Map();
      let index = 0;

      logsInPeriod.forEach((log) => {
        const dateLog = dayjs
          .unix(log["timeStart"])
          .hour(0)
          .minute(0)
          .second(0);
        const eleName = log[populate.path][populate.select];
        if (!dataMap.has(eleName))
          dataMap.set(eleName, {
            name: eleName,
            views: 0,
            runTime: 0,
            cost: 0,
            dataPoint: 0,
            index: 0,
            data: Array(noDataPoints).fill(0),
          });
        const curAd = dataMap.get(eleName);
        if (index > curAd.index) {
          curAd.index = index;
        }
        curAd.views += log["views"];
        curAd.runTime += log["runTime"];
        curAd.cost += log["moneyCharge"];
        if (isSameTotal(dateStart, dateLog, frequency)) {
          curAd.data[index] += log[value];
        } else {
          const dayDiff = dateLog.diff(dateStart, "d");
          for (let i = 0; i + frequency <= dayDiff; i += frequency) {
            index += 1;
            curAd.index += 1;
            dateStart = dateStart.add(frequency, "d");
          }
          curAd.data[index] += log[value];
        }
      });
      const data = [];
      dataMap.forEach((dt) => data.push(dt));
      return res.status(config.status_code.OK).send({ data });
    } catch (error) {
      console.log(error);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error.message });
    }
  };
}

function getByEnumGenerator(enumName, getNameCb, queryCheckCb) {
  return async function (req, res) {
    try {
      const userId = req.userId;
      let { frequency, timeStart, timeEnd, item } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const adFindOption = !item || item === "all" ? {} : { adOfferId: item };
      let dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
      const logsInPeriod = await reportVideoLog
        .find({
          adManagerId: userId,
          timeStart: {
            $gte: dateStart.unix(),
            $lte: dayjs.unix(timeEnd).hour(23).unix(),
          },
          ...adFindOption,
        })
        .sort("timeStart");
      frequency = Number(frequency);
      const noDataPoints =
        Math.floor(
          (1.0 * dayjs.unix(timeEnd).hour(1).diff(dateStart, "d")) / frequency
        ) + 1;
      const dataMap = new Map();
      let index = 0;

      logsInPeriod.forEach((log) => {
        const dateLog = dayjs
          .unix(log["timeStart"])
          .hour(0)
          .minute(0)
          .second(0);
        const eleValue = log[enumName];
        eleValue.forEach((eleValue, i) => {
          const eleName = getNameCb(i);
          if (!dataMap.has(eleName))
            dataMap.set(eleName, {
              name: eleName,
              views: 0,
              index: 0,
              data: Array(noDataPoints).fill(0),
            });
          const curAd = dataMap.get(eleName);
          if (index > curAd.index) {
            curAd.index = index;
          }
          curAd.views += eleValue;
          if (isSameTotal(dateStart, dateLog, frequency)) {
            curAd.data[index] += eleValue;
          } else {
            const dayDiff = dateLog.diff(dateStart, "d");
            for (let i = 0; i + frequency <= dayDiff; i += frequency) {
              index += 1;
              curAd.index += 1;
              dateStart = dateStart.add(frequency, "d");
            }
            curAd.data[index] += eleValue;
          }
        });
      });
      const data = [];
      dataMap.forEach((dt) => data.push(dt));
      return res.status(config.status_code.OK).send({ data });
    } catch (error) {
      console.log(error.message);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error.message });
    }
  };
}
function checkValidQuery(options) {
  return (query) => {
    const { value, frequency } = query;
    const { values, frequencies } = {
      values: ["views", "runTime", "moneyCharge"],
      frequencies: [1, 7, 30],
      ...options,
    };
    if (!values.includes(value) || !frequencies.includes(Number(frequency))) {
      throw new Error("Invalid query parameter value");
    }
  };
}
const getByAdOffer = getByGenerator(
  { path: "adOfferId", select: "name" },
  checkValidQuery()
);
const getByBdManager = getByGenerator(
  {
    path: "bdManagerId",
    select: "username",
  },
  checkValidQuery()
);
const getByAge = getByEnumGenerator(
  "ages",
  getAgeTagName,
  checkValidQuery({ values: ["views"] })
);

const getByGender = getByEnumGenerator(
  "genders",
  (index) => (index === 0 ? "Male" : "Female"),
  checkValidQuery({ values: ["views"] })
);

async function getOverview(req, res) {
  try {
    const userId = req.userId;
    let { timeStart, timeEnd } = req.query;

    let dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
    const logsInPeriod = await reportVideoLog
      .find({
        adManagerId: userId,
        timeStart: {
          $gte: dateStart.unix(),
          $lte: dayjs.unix(timeEnd).hour(23).unix(),
        },
      })
      .sort("timeStart")
      .populate({ path: "adOfferId", select: "name _id" });
    const frequency = 1;
    let totalViews = 0;
    let totalRunTime = 0;
    let totalCost = 0;
    const noDataPoint = getNoDataPoint(timeStart, timeEnd);
    const views = new Array(noDataPoint).fill(0);
    const runTime = new Array(noDataPoint).fill(0);
    const cost = new Array(noDataPoint).fill(0);
    const dataMap = new Map();
    let index = 0;
    logsInPeriod.forEach((log) => {
      const dateLog = dayjs.unix(log["timeStart"]).hour(0).minute(0).second(0);
      const eleName = log["adOfferId"]["name"];
      if (!dataMap.has(eleName))
        dataMap.set(eleName, {
          _id: log["adOfferId"]["_id"],
          name: eleName,
          views: 0,
          runTime: 0,
          cost: 0,
        });
      const curAd = dataMap.get(eleName);

      curAd.views += log["views"];
      curAd.runTime += log["runTime"];
      curAd.cost += log["moneyCharge"];
      totalViews += log["views"];
      totalRunTime += log["runTime"];
      totalCost += log["moneyCharge"];
      if (isSameTotal(dateStart, dateLog, frequency)) {
        views[index] += log["views"];
        runTime[index] += log["runTime"];
        cost[index] += log["moneyCharge"];
      } else {
        const dayDiff = dateLog.diff(dateStart, "d");
        for (let i = 0; i + frequency <= dayDiff; i += frequency) {
          index += 1;
          curAd.index += 1;
          dateStart = dateStart.add(frequency, "d");
        }
        views[index] += log["views"];
        runTime[index] += log["runTime"];
        cost[index] += log["moneyCharge"];
      }
    });
    const topAds = [];
    dataMap.forEach((data) => topAds.push(data));
    const data = {
      totalViews,
      totalRunTime,
      totalCost,
      views,
      runTime,
      cost,
      top: topAds,
    };
    return res.status(config.status_code.OK).send({ data });
  } catch (error) {
    console.log(error);
    return res
      .status(config.status_code.SERVER_ERROR)
      .send({ message: error.message });
  }
}

async function getAllByPeriod(req, res) {
  try {
    const userId = req.userId;
    let { timeStart, timeEnd } = req.query;
    const typeUser = (await userService.getUserById(userId)).typeUser;
    let dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
    const logsInPeriod = await reportVideoLog
      .find({
        [typeUser === "adManager" ? "adManagerId" : "bdManagerId"]: userId,
        timeStart: {
          $gte: dateStart.unix(),
          $lte: dayjs.unix(timeEnd).hour(23).unix(),
        },
      })
      .sort("-timeStart")
      .populate({ path: "adOfferId", select: "name _id" })
      .populate({ path: "adManagerId", select: "username _id" })
      .populate({ path: "bdManagerId", select: "username _id" })
      .populate({
        path: "videoId",
        select: "name _id path",
        transform: nullTransform,
      })
      .populate({
        path: "zoneId",
        select: "name _id pricePerTimePeriod",
        transform: nullTransform,
      })
      .populate({
        path: "deviceId",
        select: "name _id",
        transform: nullTransform,
      })
      .select("-raw");
    const logs = logsInPeriod.map((log) => ({
      ...log.toObject(),
      ad: log.adOfferId,
      bdManager: log.bdManagerId,
      video: log.videoId,
      zone: log.zoneId,
      device: log.deviceId,
      cost: log.moneyCharge,
      image: log.imagePath,
    }));
    // console.log("logs", logs[0]);
    return res.status(config.status_code.OK).send({ logs });
  } catch (error) {
    console.log(error);
    return res
      .status(config.status_code.SERVER_ERROR)
      .send({ message: error.message });
  }
}
async function getByPeriod(req, res) {
  try {
    const userId = req.userId;
    const { timeS, timeE } = req.params;
    const reportVideoLogDocument = await reportVideoLogService.getByPeriod(
      userId,
      timeS,
      timeE
    );
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteByUserId(req, res) {
  try {
    const userId = req.userId;
    const reportVideoLogDocument = await reportVideoLogService.getByOneParam(
      userId
    );
    if (reportVideoLogDocument["userId"].toString() != userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await reportVideoLogService.deleteByUserId(userId);
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function insert(req, res) {
  try {
    // console.log(req.body);

    let infor = {
      adOfferId: req.body.adOfferId,
      deviceId: req.body.deviceId,
      zoneId: req.body.zoneId,
      videoId: req.body.videoId,
      durationFull: req.body.durationFull,
      position: req.body.position,
      timeStamp: req.body.timeStamp,
      snapshots: req.body.snapshots,
      timeEnd: req.body.timeEnd,
      price: req.body.price,
    };
    if (req.body.moneyCharge && req.body.runTime) {
      infor["moneyCharge"] = req.body.moneyCharge;
      infor["runTime"] = req.body.runTime;
    }
    if (!Array.isArray(req.body.snapshots)) {
      infor["snapshots"] = [req.body.snapshots];
    }
    // console.log("==================AI+===============");
    // console.log(infor);
    const image = req.file;
    let urlImageGlobal = null;

    // const typeImage = handle.getTypeFile(image.mimetype);
    const signatureName = handle.getSignatureName();
    const nameImageInPath = signatureName + "." + "jpg";
    const pathImageStorage = `${config.upload_folder}${config.image_folder}${nameImageInPath}`;
    await handle.moveFile(image.path, pathImageStorage);
    urlImageGlobal = `http://${config.host}:${config.port}/${nameImageInPath}`;

    let rpLogDoc = await reportVideoLogService.findOneBy({
      adOfferId: infor["adOfferId"],
      deviceId: infor["deviceId"],
      videoId: infor["videoId"],
      zoneId: infor["zoneId"],
      timeStart: infor["timeStamp"],
    });
    if (rpLogDoc) {
      return res.status(200).send("infor sent");
    }

    const totalAgeCounts = Array(9).fill(0);
    const totalGenderCounts = [0, 0];
    let totalFaces = 0;
    infor["snapshots"].forEach((ele) => {
      ele = ele.split("'").join('"');
      ele = JSON.parse(ele);
      const { ages, genders } = ele;
      ages.map((age) => (totalAgeCounts[getAgeTag(age)] += 1));
      genders.map((gender) =>
        gender === "M" ? totalGenderCounts[0]++ : totalGenderCounts[1]++
      );
      totalFaces += ele["number_of_face"];
    });
    let adOffer = await adOfferService.getById(infor["adOfferId"]);
    const zoneDoc = await zoneService.getById(infor["zoneId"]);
    const videoDoc = await videoService.getById(infor["videoId"]);
    let tempCharge = await tempVideoChargeService.findOneBy(
      {
        videoId: infor["videoId"],
        deviceId: infor["deviceId"],
        timeStamp: Number.parseFloat(infor["timeStamp"]),
        adOfferId: infor["adOfferId"],
        zoneId: infor["zoneId"],
      },
      {}
    );

    if (!tempCharge) {
      return res.status(403).send({
        message: "video didnt recognize",
      });
    }
    let tempBudget = adOffer["tempBudget"];
    let remainingBudget = adOffer["remainingBudget"];
    let runTime = infor["durationFull"];

    // if (infor["timeEnd"] < infor["timeStamp"]) {
    //   runTime = infor["snapshots"].length * 30;
    //   if (runTime > infor["duration"]) {
    //     runTime = infor["duration"];
    //   }
    //   remainingBudget -=
    //     Number.parseInt(runTime) * zoneDoc["pricePerTimePeriod"];
    //   tempBudget -= Number.parseInt(runTime) * zoneDoc["pricePerTimePeriod"];
    // } else {
    //   runTime = infor["timeEnd"] - infor["timeStamp"];
    //   if (runTime > infor["duration"]) runTime = infor["duration"];
    //   remainingBudget -=
    //     Number.parseInt(runTime) * zoneDoc["pricePerTimePeriod"];
    //   tempBudget -= Number.parseInt(runTime) * zoneDoc["pricePerTimePeriod"];
    // }
    let moneyCharge = runTime * zoneDoc["pricePerTimePeriod"];
    if (infor["moneyCharge"] && infor["runTime"]) {
      tempBudget += videoDoc["duration"] * infor["price"];
      moneyCharge = infor["moneyCharge"];
      remainingBudget -= moneyCharge;
      tempBudget -= moneyCharge;
      runTime = infor["runTime"];
    } else {
      tempBudget += videoDoc["duration"] * zoneDoc["pricePerTimePeriod"];
    }
    let newReportVideoLogDoc = reportVideoLogService.createModel({
      adOfferId: infor["adOfferId"],
      deviceId: infor["deviceId"],
      adManagerId: adOffer["adManagerId"],
      bdManagerId: adOffer["bdManagerId"],
      videoId: infor["videoId"],
      zoneId: infor["zoneId"],
      timeStart: infor["timeStamp"],
      runTime: Number.parseFloat(runTime).toFixed(2),
      views: totalFaces,
      ages: totalAgeCounts,
      genders: totalGenderCounts,
      raw: infor,
      imagePath: urlImageGlobal,
      moneyCharge: moneyCharge,
    });
    await reportVideoLogService.insert(newReportVideoLogDoc);
    await adOfferService.updateById(adOffer["_id"], {
      remainingBudget: remainingBudget,
      tempBudget: tempBudget,
    });

    let zones = await zoneService.findByPipeLine({
      adArray: { $in: [adOffer["_id"]] },
    });
    for (let i = 0; i < zones.length; i++) {
      audio_module.get_audio_io().to(infor["zoneId"]).emit("update-zone", {
        zoneId: infor["zoneId"],
        adOfferId: adOffer["_id"],
        remainingBudget: adOffer["remainingBudget"],
      });
    }
    socketService
      .getIO()
      .in(adOffer["bdManagerId"].toString())
      .emit(`/receive/update/${infor["zoneId"]}/infor-video-result`, {
        ...newReportVideoLogDoc.toObject(),
      });
    return res.status(200).send({
      reportVideoLog: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

function getSummary(matchCb) {
  return async (req, res) => {
    try {
      const data = (await reportVideoLogService.getSummary(matchCb(req)))[0];
      return res.status(config.status_code.OK).send({ data: data || {} });
    } catch (error) {
      console.log(error);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error });
    }
  };
}

const getSummaryForAd = getSummary((req) => ({
  adManagerId: ObjectId(req.userId),
}));
const getSummaryForBd = getSummary((req) => ({
  bdManagerId: ObjectId(req.userId),
}));

module.exports = {
  getByPeriod: getByPeriod,
  getByUserId: getByUserId,
  deleteByUserId: deleteByUserId,
  getByAdOffer,
  getByBdManager,
  getByAge,
  getByGender,
  getOverview,
  insert,
  getAllByPeriod,
  getSummaryForAd,
  getSummaryForBd,
};
