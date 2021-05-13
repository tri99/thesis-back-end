const reportVideoLogService = require("./../services/reportVideoLog");
const reportVideoLog = require("./../collections/reportVideoLog");
const config = require("./../config/config");
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
async function getByAdOffer(req, res) {
  try {
    const userId = req.userId;
    let { value, frequency, timeStart, timeEnd } = req.query;
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
      .populate({ path: "adOfferId", select: "name" });
    frequency = Number(frequency);
    const noDataPoints =
      Math.floor(
        (1.0 * dayjs.unix(timeEnd).hour(1).diff(dateStart, "d")) / frequency
      ) + 1;
    const dataMap = new Map();
    let index = 0;

    logsInPeriod.forEach((log) => {
      const dateLog = dayjs.unix(log["timeStart"]).hour(0).minute(0).second(0);
      const adName = log["adOfferId"]["name"];
      if (!dataMap.has(adName))
        dataMap.set(adName, {
          name: adName,
          views: 0,
          runTime: 0,
          dataPoint: 0,
          index: 0,
          data: Array(noDataPoints).fill(0),
        });
      const curAd = dataMap.get(adName);
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
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
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
};
