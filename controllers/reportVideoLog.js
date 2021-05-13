const reportVideoLogService = require("./../services/reportVideoLog");
const config = require("./../config/config");

async function getByUserId(req, res) {
  try {
    const userId = req.userId;
    const reportVideoLogDocument = await reportVideoLogService.getByOneParam(
      userId
    );
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

// async function getByAdOffer(req, res) {
//   try {
//     const userId = req.userId;
//     const { value, frequency, timeStart, timeEnd } = req.query;
//     const logsInPeriod = await reportVideoLogService.findByPipeLine({
//       adManagerId: userId,
//       timeStart: { $gte: timeStart, $lte: timeEnd },
//     });
//   } catch (error) {
//     return res.status(config.status_code.SERVER_ERROR).send({ message: error });
//   }
// }
async function getByPeriod(req, res) {
  try {
    const userId = req.userId;
    const { timeS, timeE } = req.params;
    const reportVideoLogDocument = await reportVideoLogService.getByPeriod(
      userId,
      timeS,
      timeE
    );
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function deleteByUserId(req, res) {
  try {
    const userId = req.userId;
    const reportVideoLogDocument = await reportVideoLogService.getByOneParam(
      userId
    );
    if (reportVideoLogDocument["userId"].toString() != userId) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong user" });
    }
    await reportVideoLogService.deleteByUserId(userId);
    return res
      .status(config.status_code.OK)
      .send({ report: reportVideoLogDocument });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  getByPeriod: getByPeriod,
  getByUserId: getByUserId,
  deleteByUserId: deleteByUserId,
};
