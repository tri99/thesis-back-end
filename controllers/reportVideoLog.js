const reportVideoLogService = require("./../services/reportVideoLog");
const reportVideoLog = require("./../collections/reportVideoLog");
const config = require("./../config/config");
const { getAgeTagName } = require("../utils/ageGenders");
const dayjs = require("dayjs");
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
      let { value, frequency, timeStart, timeEnd, adOffer } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const adFindOption =
        !adOffer || adOffer === "all" ? {} : { adOfferId: adOffer };
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
      let { frequency, timeStart, timeEnd, adOffer } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const adFindOption =
        !adOffer || adOffer === "all" ? {} : { adOfferId: adOffer };
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
function checkValidQuery({
  values = ["views", "runTime"],
  frequencies = [1, 7, 30],
}) {
  return (query) => {
    const { value, frequency } = query;
    if (!values.includes(value) || !frequencies.includes(Number(frequency))) {
      throw new Error("Invalid query parameter value");
    }
  };
}
const getByAdOffer = getByGenerator(
  { path: "adOfferId", select: "name" },
  checkValidQuery
);
const getByBdManager = getByGenerator(
  {
    path: "bdManagerId",
    select: "username",
  },
  checkValidQuery
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
    const noDataPoint = getNoDataPoint(timeStart, timeEnd);
    const views = new Array(noDataPoint).fill(0);
    const runTime = new Array(noDataPoint).fill(0);
    const dataMap = new Map();
    let index = 0;
    logsInPeriod.forEach((log) => {
      const dateLog = dayjs.unix(log["timeStart"]).hour(0).minute(0).second(0);
      const eleName = log["adOfferId"]["name"];
      if (!dataMap.has(eleName))
        dataMap.set(eleName, {
          id: log["adOfferId"]["_id"],
          name: eleName,
          views: 0,
          runTime: 0,
        });
      const curAd = dataMap.get(eleName);

      curAd.views += log["views"];
      curAd.runTime += log["runTime"];
      totalViews += log["views"];
      totalRunTime += log["runTime"];
      if (isSameTotal(dateStart, dateLog, frequency)) {
        views[index] += log["views"];
        runTime[index] += log["runTime"];
      } else {
        const dayDiff = dateLog.diff(dateStart, "d");
        for (let i = 0; i + frequency <= dayDiff; i += frequency) {
          index += 1;
          curAd.index += 1;
          dateStart = dateStart.add(frequency, "d");
        }
        views[index] += log["views"];
        runTime[index] += log["runTime"];
      }
    });
    const topAds = [];
    dataMap.forEach((data) => topAds.push(data));
    const data = {
      totalViews,
      totalRunTime,
      views,
      runTime,
      topAds,
    };
    return res.status(config.status_code.OK).send({ data });
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

module.exports = {
  getByPeriod: getByPeriod,
  getByUserId: getByUserId,
  deleteByUserId: deleteByUserId,
  getByAdOffer,
  getByBdManager,
  getByAge,
  getByGender,
  getOverview,
};
