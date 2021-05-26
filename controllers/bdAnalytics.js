const config = require("../config/config");
const zoneService = require("../services/zone-ver2");
const dayjs = require("dayjs");
var isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
var isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const { getAgeTagName } = require("../utils/ageGenders");
const reportVideoLog = require("./../collections/reportVideoLog");

function diffFreq(dateStart, dateLog, frequency) {
  return Math.floor(dateLog.diff(dateStart, "d") / frequency);
}
function getByGenerator(queryCheckCb, $lookup, nameKey = "name") {
  return async (req, res) => {
    try {
      let { frequency, item, timeStart, timeEnd, value } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const zoneFindOption = item === "all" ? {} : { _id: item };
      const allZones = await zoneService.findBy(
        { userId: req.userId, name: { $ne: "General" }, ...zoneFindOption },
        {
          select: "_id",
        }
      );
      const allZoneIds = allZones.map((zone) => zone._id);
      const dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
      const dateEnd = dayjs.unix(timeEnd).hour(23);
      const zonesData = await zoneService.getAnalytics(
        allZoneIds,
        {
          timeStart: dateStart.unix(),
          timeEnd: dateEnd.unix(),
          value,
        },
        $lookup
      );
      console.log(zonesData[0]);
      frequency = Number(frequency);
      const noDataPoints =
        Math.floor((1.0 * dateEnd.diff(dateStart, "d")) / frequency) + 1;
      const result = zonesData.map((zoneData) => {
        const data = Array(noDataPoints).fill(0);
        zoneData.logs.forEach((log) => {
          const dateLog = dayjs
            .unix(log["timeStart"])
            .hour(0)
            .minute(0)
            .second(0);
          data[diffFreq(dateStart, dateLog, frequency)] += log.value;
        });
        delete zoneData.logs;
        return { ...zoneData, name: zoneData[$lookup.as][nameKey], data };
      });
      return res.status(config.status_code.OK).send({ data: result });
    } catch (error) {
      console.log(error);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error.message });
    }
  };
}

function checkValidQuery(options) {
  return (query) => {
    const { value, frequency } = query;
    const { values, frequencies } = {
      values: ["views", "runTime", "moneyCharge"],
      frequencies: [1, 7, 30],
      ...options,
    };
    console.log(value, values);
    if (!values.includes(value) || !frequencies.includes(Number(frequency))) {
      throw new Error("Invalid query parameter value");
    }
  };
}

const getByZone = getByGenerator(checkValidQuery(), {
  from: "zones",
  localField: "zoneId",
  foreignField: "_id",
  as: "zone",
});
const getByAdManager = getByGenerator(
  checkValidQuery(),
  {
    from: "users",
    localField: "adManagerId",
    foreignField: "_id",
    as: "adManager",
  },
  "username"
);
function isSameTotal(dateStart, dateLog, frequency) {
  return (
    dateLog.isSameOrAfter(dateStart, "d") &&
    dateLog.isSameOrBefore(dateStart.add(frequency - 1, "d"), "d")
  );
}

function getByEnumGenerator(enumName, getNameCb, queryCheckCb) {
  return async function (req, res) {
    try {
      const userId = req.userId;
      let { frequency, timeStart, timeEnd, item } = req.query;
      if (queryCheckCb) queryCheckCb(req.query);
      const zoneFindOption = !item || item === "all" ? {} : { zoneId: item };
      let dateStart = dayjs.unix(timeStart).hour(0).minute(0).second(0);
      const logsInPeriod = await reportVideoLog
        .find({
          bdManagerId: userId,
          timeStart: {
            $gte: dateStart.unix(),
            $lte: dayjs.unix(timeEnd).hour(23).unix(),
          },
          ...zoneFindOption,
        })
        .sort("timeStart");
      frequency = Number(frequency);
      const noDataPoints =
        Math.floor(
          (1.0 * dayjs.unix(timeEnd).hour(1).diff(dateStart, "d")) / frequency
        ) + 1;
      const dataMap = new Map();
      let index = 0;

      logsInPeriod.forEach((log) => {
        const dateLog = dayjs
          .unix(log["timeStart"])
          .hour(0)
          .minute(0)
          .second(0);
        const eleValue = log[enumName];
        eleValue.forEach((eleValue, i) => {
          const eleName = getNameCb(i);
          if (!dataMap.has(eleName))
            dataMap.set(eleName, {
              name: eleName,
              views: 0,
              index: 0,
              data: Array(noDataPoints).fill(0),
            });
          const curAd = dataMap.get(eleName);
          if (index > curAd.index) {
            curAd.index = index;
          }
          curAd.views += eleValue;
          if (isSameTotal(dateStart, dateLog, frequency)) {
            curAd.data[index] += eleValue;
          } else {
            const dayDiff = dateLog.diff(dateStart, "d");
            for (let i = 0; i + frequency <= dayDiff; i += frequency) {
              index += 1;
              curAd.index += 1;
              dateStart = dateStart.add(frequency, "d");
            }
            curAd.data[index] += eleValue;
          }
        });
      });
      const data = [];
      dataMap.forEach((dt) => data.push(dt));
      return res.status(config.status_code.OK).send({ data });
    } catch (error) {
      console.log(error.message);
      return res
        .status(config.status_code.SERVER_ERROR)
        .send({ message: error.message });
    }
  };
}

const getByAge = getByEnumGenerator(
  "ages",
  getAgeTagName,
  checkValidQuery({ values: ["views"] })
);

const getByGender = getByEnumGenerator(
  "genders",
  (index) => (index === 0 ? "Male" : "Female"),
  checkValidQuery({ values: ["views"] })
);
module.exports = { getByZone, getByAdManager, getByAge, getByGender };
