const reportVideoLog = require("./../collections/reportVideoLog");
const basicCRUDGenerator = require("./basicCRUD");
const logCRUD = basicCRUDGenerator(reportVideoLog);

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

module.exports = {
  ...logCRUD,
  deleteByUserId: deleteByUserId,
  getByOneParam: getByOneParam,
  getByPeriod: getByPeriod,
};
