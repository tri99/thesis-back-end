const User = require("./../collections/user");
const basicCRUDGenerator = require("./basicCRUD");
const userCRUD = basicCRUDGenerator(User);

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .select()
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function getUserById(_id) {
  return new Promise((resolve, reject) => {
    User.findById(_id)
      .select()
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function getUserByListId(listuserId) {
  return new Promise((resolve, reject) => {
    User.find({ _id: { $in: listuserId } })
      .select("_id username email adminId")
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function getUserByTypeUser(typeUser) {
  return new Promise((resolve, reject) => {
    User.find({ typeUser: typeUser, adminId: null })
      .select("_id username email desc avatar")
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function getAllUser() {
  return new Promise((resolve, reject) => {
    User.find()
      .select("_id username email adminId")
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function updateUserById(_id, username, desc) {
  return new Promise((resolve, reject) => {
    User.updateOne({ _id }, { username, desc }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function updatePermissionUserById(_id, permission) {
  return new Promise((resolve, reject) => {
    User.updateOne({ _id: _id }, { permission: permission }).exec((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

module.exports = {
  ...userCRUD,
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  updateUserById: updateUserById,
  getAllUser: getAllUser,
  updatePermissionUserById: updatePermissionUserById,
  getUserByListId: getUserByListId,
  getUserByTypeUser: getUserByTypeUser,
};
