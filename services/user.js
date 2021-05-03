const User = require("./../collections/user");

function createModel(username, email, password, admin) {
  const newUserDocument = new User({
    username: username,
    email: email,
    password: password,
    admin,
  });
  return newUserDocument;
}

function insert(newUserDocument) {
  return new Promise((resolve, reject) => {
    newUserDocument.save((error) => {
      if (error) return reject(error);
      return resolve(true);
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .select("username email password adminId")
      .exec((error, userDocument) => {
        if (error) return reject(error);
        return resolve(userDocument);
      });
  });
}

function getUserById(_id) {
  return new Promise((resolve, reject) => {
    User.findById(_id)
      .select("_id username email adminId")
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

function updateUserById(_id, username, password) {
  return new Promise((resolve, reject) => {
    User.updateOne(
      { _id: _id },
      { username: username, password: password }
    ).exec((error) => {
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
  createModel: createModel,
  insert: insert,
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  updateUserById: updateUserById,
  getAllUser: getAllUser,
  updatePermissionUserById: updatePermissionUserById,
  getUserByListId: getUserByListId,
};