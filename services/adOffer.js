const adOffer = require("./../collections/adOffer");
const ReportVideoLog = require("./../collections/reportVideoLog");
const basicCRUDGenerator = require("./basicCRUD");
const adOfferCRUD = basicCRUDGenerator(adOffer);
module.exports = {
  ...adOfferCRUD,
  getFullInfor,
  getManyFullInfor,
  getTable,
};

function getFullInfor(findOption) {
  return new Promise((resolve, reject) => {
    adOffer
      .findOne(findOption)
      .populate({
        path: "bdManagerId",
        select: "_id username email avatar desc",
      })
      .populate({ path: "adManagerId", select: "_id username email" })
      .populate({ path: "contentId" })
      .populate({ path: "adSetId" })
      .populate({
        path: "zoneIds",
        select: "name locationDesc location pricePerTimePeriod priceArray",
      })
      .exec((error, document) => {
        if (error) return reject(error);
        return resolve(document);
      });
  });
}

function getManyFullInfor(ids) {
  return new Promise((resolve, reject) => {
    adOffer
      .find({ _id: { $in: ids } })
      .populate({ path: "bdManagerId", select: "_id username email" })
      .populate({ path: "adManagerId", select: "_id username email" })
      .populate({ path: "contentId" })
      .populate({ path: "adSetId" })
      .exec((error, document) => {
        if (error) return reject(error);
        return resolve(document);
      });
  });
}

function getTable(adIds, matchOption = {}) {
  return ReportVideoLog.aggregate([
    { $match: { adOfferId: { $in: adIds }, ...matchOption } },
    {
      $group: {
        _id: "$adOfferId",
        views: { $sum: "$views" },
        runTime: { $sum: "$runTime" },
        cost: { $sum: "$moneyCharge" },
        avgViews: { $avg: "$views" },
        avgRunTime: { $avg: "$runTime" },
      },
    },
  ]).exec();
}
