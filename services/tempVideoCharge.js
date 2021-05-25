const basicCRUD = require("./basicCRUD");

const tempVideoCharge = require("./../collections/tempVideoCharge");

const tempVideoChargeCRUD = basicCRUD(tempVideoCharge);

module.exports = {
  ...tempVideoChargeCRUD,
};
