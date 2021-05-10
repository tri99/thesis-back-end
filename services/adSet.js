const adSet = require("./../collections/adSet");
const basicCRUDGenerator = require("./basicCRUD");
const adSetCRUD = basicCRUDGenerator(adSet);

module.exports = {
  ...adSetCRUD,
};
