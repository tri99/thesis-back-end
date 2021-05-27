const zone = require("../collections/zone");
const basicCRUDGenerator = require("./basicCRUD");
const ReportVideoLog = require("./../collections/reportVideoLog");
const zoneCRUD = basicCRUDGenerator(zone);
const audio_module = require("./../exports/audio-io");

module.exports = {
  ...zoneCRUD,
  getByIdwithAdName,
  getOverview,
  pushAdInZones,
  getTable,
  getTopZones,
  pullAdFromZones,
  emitToZones,
  getAnalytics,
};
function emitToZones(zoneIds) {
  for (let i = 0; i < zoneIds.length; i++) {
    audio_module
      .get_audio_io()
      .to(zoneIds[i].toString())
      .emit("update-zone", { zoneId: zoneIds[i] });
  }
}
function getByIdwithAdName(id) {
  return zone.findById(id).populate("adArray").select().exec();
}

async function pushAdInZones(adId, zoneIds) {
  await zone
    .updateMany({ _id: { $in: zoneIds } }, { $push: { adArray: adId } })
    .exec();
  emitToZones(zoneIds);
}

async function pullAdFromZones(adId, zoneIds) {
  await zone
    .updateMany({ _id: { $in: zoneIds } }, { $pull: { adArray: adId } })
    .exec();
  emitToZones(zoneIds);
}

function getTable(zoneIds) {
  return ReportVideoLog.aggregate([
    { $match: { zoneId: { $in: zoneIds } } },
    {
      $group: {
        _id: "$zoneId",
        views: { $sum: "$views" },
        runTime: { $sum: "$runTime" },
        cost: { $sum: "$moneyCharge" },
        avgViews: { $avg: "$views" },
        avgRunTime: { $avg: "$runTime" },
      },
    },
  ]).exec();
}

function getAnalytics(zoneIds, query, $lookup) {
  let { value, timeStart, timeEnd } = query;
  const lookupKey = $lookup.as;
  return ReportVideoLog.aggregate([
    {
      $match: {
        zoneId: { $in: zoneIds },
        timeStart: { $gte: timeStart, $lte: timeEnd },
      },
    },
    {
      $lookup,
      // $lookup: {
      //   from: "users",
      //   localField: "adManagerId",
      //   foreignField: "_id",
      //   as: "adManager",
      // },
    },
    {
      $unwind: `$${lookupKey}`,
    },
    {
      $group: {
        _id: `$${lookupKey}._id`,
        [lookupKey]: { $first: `$${lookupKey}` },
        views: { $sum: "$views" },
        runTime: { $sum: "$runTime" },
        cost: { $sum: "$moneyCharge" },
        avgViews: { $avg: "$views" },
        avgRunTime: { $avg: "$runTime" },
        logs: { $push: { value: `$${value}`, timeStart: `$timeStart` } },
      },
    },
  ]).exec();
}

function getOverview(bdManagerId, query) {
  let { timeStart, timeEnd } = query;
  return ReportVideoLog.aggregate([
    {
      $match: {
        bdManagerId,
        timeStart: { $gte: timeStart, $lte: timeEnd },
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
        totalRunTime: { $sum: "$runTime" },
        totalProfit: { $sum: "$moneyCharge" },
        logs: {
          $push: {
            views: "$views",
            runTime: "$runTime",
            profit: "$moneyCharge",
            timeStart: `$timeStart`,
          },
        },
      },
    },
  ]).exec();
}

function getTopZones(bdManagerId, query) {
  let { timeStart, timeEnd } = query;
  return ReportVideoLog.aggregate([
    {
      $match: {
        bdManagerId,
        timeStart: { $gte: timeStart, $lte: timeEnd },
      },
    },
    {
      $lookup: {
        from: "zones",
        localField: "zoneId",
        foreighField: "_id",
        as: "zone",
      },
    },
    {
      $unwind: "$zone",
    },
    {
      $group: {
        _id: "$zoneId",
        name: { $first: "$zone.name" },
        views: { $sum: "$views" },
        runTime: { $sum: "$runTime" },
        profit: { $sum: "$moneyCharge" },
      },
    },
  ]).exec();
}
