const adOfferService = require("./../services/adOffer");
const playlistService = require("./../services/playlist");
const videoService = require("./../services/video");

async function getAdSetStatus(adSetId) {
  let adOfferDoc = await adOfferService.findByPipeLine({
    adSetId: adSetId,
    $or: [{ status: "pending" }, { status: "deployed" }, { status: "empty" }],
  });
  if (adOfferDoc != []) {
    return { result: false, adOfferDoc: adOfferDoc };
  }
  let videoDoc = await videoService.findByPipeLine({ adSetId: adSetId });
  const videoIdArray = videoDoc.map((x) => x.toString());
  let playlistDoc = await playlistService.findByPipeLine({
    mediaArray: { $in: videoIdArray },
  });
  adOfferDoc = await adOfferService.findByPipeLine({
    contentId: { $in: playlistDoc },
  });
  if (adOfferDoc.length != []) {
    return { result: false, adOfferDoc: adOfferDoc };
  }
  return { result: true, adOfferDoc: [] };
}

module.exports = {
  getAdSetStatus,
};
