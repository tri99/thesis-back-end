const zone = require("../collections/zone");
const basicCRUDGenerator = require("./basicCRUD");
const zoneCRUD = basicCRUDGenerator(zone);

module.exports = {
  ...zoneCRUD,
};
