const adOffer = require("./../collections/adOffer");
const basicCRUDGenerator = require("./basicCRUD");
const adOfferCRUD = basicCRUDGenerator(adOffer);
module.exports = {
  ...adOfferCRUD,
  getFullInfor,
};

function getFullInfor(_id) {
  return new Promise((resolve, reject) => {
    adOffer
      .findOne({ _id: _id })
      .populate({ path: "bdManagerId", select: "_id username email" })
      .populate({ path: "adManagerId", select: "_id username email" })
      .populate({ path: "contentId" })
      .populate({ path: "adSetId" })
      .exec((error, document) => {
        if (error) return reject(error);
        console.log(document);
        return resolve(document);
      });
  });
}