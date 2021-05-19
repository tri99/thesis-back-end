const zone = require("../collections/zone");
const basicCRUDGenerator = require("./basicCRUD");
const zoneCRUD = basicCRUDGenerator(zone);

module.exports = {
  ...zoneCRUD,
  getByIdwithAdName,
};

function getByIdwithAdName(id) {
  return zone.findById(id).populate("adArray").select().exec();
}
