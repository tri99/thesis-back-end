const zone = require("../collections/zone");
const basicCRUDGenerator = require("./basicCRUD");
const zoneCRUD = basicCRUDGenerator(zone);

module.exports = {
  ...zoneCRUD,
  getByIdwithAdName,
  pushAdInZones,
};

function getByIdwithAdName(id) {
  return zone.findById(id).populate("adArray").select().exec();
}

function pushAdInZones(adId, zoneIds) {
  return zone
    .update({ _id: { $in: zoneIds } }, { $push: { adArray: adId } })
    .exec();
}
