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
    let condition = [];
    let AtagsX = [];
    let GtagsX = [];
    for (let j = 0; j < videos.length; j++) {
      let x = {};
      let Atags = { strict: true, value: [] };
      let Gtags = { strict: true, value: [] };
      AtagsX.push.apply(AtagsX, videos[j]["adSetId"]["ages"]["value"]);
      GtagsX.push.apply(GtagsX, videos[j]["adSetId"]["genders"]["value"]);
      Atags["value"].push.apply(
        Atags["value"],
        videos[j]["adSetId"]["ages"]["value"]
      );
      Atags["strict"] = videos[j]["adSetId"]["ages"]["strict"];
      Gtags["value"].push.apply(
        Gtags["value"],
        videos[j]["adSetId"]["genders"]["value"]
      );
      Gtags["strict"] = videos[j]["adSetId"]["genders"]["strict"];
      x["daysOfWeek"] = adOfferDoc[i]["adSetId"]["daysOfWeek"];
      x["hoursOfDay"] = adOfferDoc[i]["adSetId"]["hoursOfDay"];
      x["ages"] = Atags;
      x["genders"] = Gtags;
      x["_id"] = videos[j]["_id"];
      x["duration"] = videos[j]["duration"];
      condition.push(x);
    }
    let AtagsV = [...new Set(AtagsX)];
    let GtagsV = [...new Set(GtagsX)];
    adOfferDoc[i]["adSetId"]["ages"]["value"] = AtagsV;
    adOfferDoc[i]["adSetId"]["genders"]["value"] = GtagsV;
    adOfferDoc[i]["adSetId"]["condition"] = condition;
    videoArray.push.apply(videoArray, adOfferDoc[i]["contentId"]["mediaArray"]);
    data["playlistArray"].push(adOfferDoc[i]["contentId"]);
  }
  // let videos = [...new Set(videoArray)];
  let videos = videoArray.filter(function (elem, pos) {
    return videoArray.indexOf(elem) == pos;
  });
  let videoDoc = await videoService.getManyByArrayIdFull(videos);
  videoDoc = JSON.stringify(videoDoc);
  videoDoc = JSON.parse(videoDoc);
  for (let i = 0; i < videoDoc.length; i++) {
    videoDoc[i]["point"] = 0;
    videoDoc[i]["played"] = false;
  }
  // console.log("================", videos);
  data = JSON.stringify(data);
  data = JSON.parse(data);
  data["adArray"] = adOfferDoc;
  data["videoArray"] = videoDoc;
  // console.log(data);
  return data;
}

module.exports = {
  convertZoneData,
};
