const reportVideoLog = require("./../collections/reportVideoLog");
const basicCRUDGenerator = require("./basicCRUD");
const logCRUD = basicCRUDGenerator(reportVideoLog);
const dayjs = require("dayjs");
function getByOneParam(key) {
  return new Promise((resolve, reject) => {
    reportVideoLog
      .find({ key: key })
      .select()
      .exec((error, reportVideoLogDocument) => {
        if (error) return reject(error);
        return resolve(reportVideoLogDocument);
      });
  });
}

function getByPeriod(userId, timeS, timeE) {
  return new Promise((resolve, reject) => {
    reportVideoLog
      .find({
        userId: userId,
        timeStart: { $gte: timeS, $lte: timeE },
      })
      .exec((error, reportVideoLogDocument) => {
        if (error) return reject(error);
        return resolve(reportVideoLogDocument);
      });
  });
}

function deleteByUserId(userId) {
  return new Promise((resolve, reject) => {
    reportVideoLog.deleteMany({ userId: userId }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getSummary($match) {
  const today = dayjs();
  const yesterday = today.subtract(1, "d");
  return reportVideoLog
    .aggregate([
      {
        $match: {
          ...$match,
          timeStart: { $gte: yesterday.unix(), $lte: today.unix() },
        },
      },
      {
        $group: {
          _id: null,
          views: { $sum: "$views" },
          runTime: { $sum: "$runTime" },
          cost: { $sum: "$moneyCharge" },
        },
      },
    ])
    .exec();
}
module.exports = {
  ...logCRUD,
  deleteByUserId: deleteByUserId,
  getByOneParam: getByOneParam,
  getByPeriod: getByPeriod,
  getSummary,
};
