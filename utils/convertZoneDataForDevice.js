const videoService = require("./../services/video");
const adOfferService = require("./../services/adOffer");

async function convertZoneData(data) {
  let adOfferDoc = await adOfferService.getManyFullInfor(data["adArray"]);

  let videoArray = [];
  adOfferDoc = JSON.stringify(adOfferDoc);
  adOfferDoc = JSON.parse(adOfferDoc);
  for (let i = 0; i < adOfferDoc.length; i++) {
    let videos = await videoService.getManyByArrayIdFull(
      adOfferDoc[i]["contentId"]["mediaArray"]
    );
    let Atags = [];
    let Gtags = [];
    for (let j = 0; j < videos.length; j++) {
      Atags.push.apply(Atags, videos[j]["adSetId"]["ages"]["value"]);
      Gtags.push.apply(Gtags, videos[j]["adSetId"]["genders"]["value"]);
    }
    Atags = [...new Set(Atags)];
    Gtags = [...new Set(Gtags)];
    adOfferDoc[i]["adSetId"]["ages"]["value"] = Atags;
    adOfferDoc[i]["adSetId"]["genders"]["value"] = Gtags;
    videoArray.push(adOfferDoc[i]["contentId"]["mediaArray"]);
    data["playlistArray"].push(adOfferDoc[i]["contentId"]);
  }

  let videos = [...new Set(videoArray)];
  let videoDoc = await videoService.getManyByArrayIdFull(videos[0]);
  videoDoc = JSON.stringify(videoDoc);
  videoDoc = JSON.parse(videoDoc);
  for (let i = 0; i < videoDoc.length; i++) {
    videoDoc[i]["point"] = 0;
    videoDoc[i]["played"] = false;
  }
  data = JSON.stringify(data);
  data = JSON.parse(data);
  data["adArray"] = adOfferDoc;
  data["videoArray"] = videoDoc;
  return data;
}

module.exports = {
  convertZoneData,
};
