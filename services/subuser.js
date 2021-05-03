const User = require("./../collections/user");
function getAll(adminId) {
  return new Promise((resolve, reject) => {
    User.find({ adminId })
      .select("_id username email")
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function deleteById(userId) {
  return new Promise((resolve, reject) => {
    User.deleteOne({ _id: userId }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

module.exports = {
  getAll,
  deleteById,
};
