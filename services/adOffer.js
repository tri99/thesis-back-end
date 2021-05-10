const adOffer = require("./../collections/adOffer");
const basicCRUDGenerator = require("./basicCRUD");
const adOfferCRUD = basicCRUDGenerator(adOffer);

module.exports = {
  ...adOfferCRUD,
};
