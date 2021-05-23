const adOfferService = require("./../services/adOffer");
// const playlistService = require("./../services/playlist");
// const videoService = require("./../services/video");

async function getAdSetStatus(adSetId) {
  let adOfferDoc = await adOfferService.findByPipeLine({
    adSetId: adSetId,
    status: { $in: ["pending", "deployed", "empty"] },
  });
  console.log(adOfferDoc, adOfferDoc.length);
  if (adOfferDoc.length > 0) {
    return { result: false, adOffers: adOfferDoc };
  }
  // let videoDoc = await videoService.findByPipeLine({ adSetId: adSetId });
  // const videoIdArray = videoDoc.map((x) => x.toString());
  // let playlistDoc = await playlistService.findByPipeLine({
  //   mediaArray: { $in: videoIdArray },
  // });
  // adOfferDoc = await adOfferService.findByPipeLine({
  //   contentId: { $in: playlistDoc },
  // });
  // if (adOfferDoc.length != []) {
  //   return { res: false, adOffers: adOfferDoc };
  // }
  return { result: true, adOffers: [] };
}

module.exports = {
  getAdSetStatus,
};
