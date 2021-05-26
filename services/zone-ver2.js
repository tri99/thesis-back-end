const zone = require("../collections/zone");
const basicCRUDGenerator = require("./basicCRUD");
const ReportVideoLog = require("./../collections/reportVideoLog");
const zoneCRUD = basicCRUDGenerator(zone);
const audio_module = require("./../exports/audio-io");
module.exports = {
  ...zoneCRUD,
  getByIdwithAdName,
  pushAdInZones,
  getTable,
  pullAdFromZones,
  emitToZones,
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
