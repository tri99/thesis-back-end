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
      .find({ _id: _id })
      .populate("adSetId")
      .populate({ path: "bdManagerId", select: "_id username email" })
      .populate({ path: "adManagerId", select: "_id username email" })
      .exec((error, document) => {
        if (error) return reject(error);
        console.log(document);
        return resolve(document);
      });
  });
}
