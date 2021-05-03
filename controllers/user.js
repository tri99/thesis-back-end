const UserService = require("./../services/user");
const ZoneService = require("../services/zone");
const config = require("./../config/config");

const encrypt = require("./../utils/encrypt");
const jwtToken = require("./../utils/jwt");

async function signIn(req, res) {
  try {
    let { email, password } = req.body;
    const userDocument = await UserService.getUserByEmail(email);

    if (!userDocument)
      return res
        .status(config.status_code.NOT_FOUND)
        .send({ message: config.status_message.NOT_FOUND });

    password = await encrypt.encryptPassword(password);

    if (userDocument["password"] != password)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "wrong password" });

    // TAP TRUNG XU LY
    let user = Object.assign({}, userDocument);
    delete user._doc.password;
    const token = await jwtToken.signToken(
      userDocument.adminId
        ? { id: userDocument.adminId, subuserId: userDocument._id }
        : { id: userDocument._id }
    );

    return res
      .status(config.status_code.OK)
      .send({ user: user._doc, token: token });
  } catch (error) {
    console.log(error);
    res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

function emailValidate(e) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(e).toLowerCase());
}

async function signUp(req, res) {
  try {
    let { username, email, password } = req.body;
    console.log(username, email, password);
    if (!username || !email || !password) {
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "missing field" });
    }
    if (!emailValidate(email))
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "your email is not validate" });
    if (password.length < 8)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "your password is too short" });
    // encode user password
    let userDocument = await UserService.getUserByEmail(email);
    if (userDocument)
      return res
        .status(config.status_code.FORBIDEN)
        .send({ message: "user is existed" });

    password = await encrypt.encryptPassword(password);
    let generalZone, generalZoneId;
    if (!req.userId) {
      generalZone = ZoneService.createModel([], [], [], "General", 0);
      generalZoneId = generalZone._id;
    } else {
      generalZoneId = (await UserService.getUserById(req.userId)).generalZoneId;
    }
    const newUserDocument = UserService.createModel(
      username,
      email,
      password,
      req.userId,
      generalZoneId
    );
    if (!req.userId) {
      generalZone.userId = newUserDocument._id;
      await ZoneService.insert(generalZone);
    }
    await UserService.insert(newUserDocument);

    return res.status(config.status_code.OK).send({ user: newUserDocument });
  } catch (error) {
    console.log(error);
    res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const newUserDocument = await UserService.getUserById(id);

    return res.status(200).send({ user: newUserDocument });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function getCurrentUser(req, res) {
  try {
    const newUserDocument = await UserService.getUserById(
      req.subuserId || req.userId
    );
    const currentUser = await newUserDocument.toObject();
    currentUser.zonePermissionGroups = await newUserDocument[
      "zonePermissionGroups"
    ];
    console.log("currenuser", currentUser);
    return res.status(200).send({ user: currentUser });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function getUserByListId(req, res) {
  try {
    const listUserId = req.query.listId;
    // console.log(listUserId);
    const newUserDocument = await UserService.getUserByListId(listUserId);

    return res.status(200).send({ user: newUserDocument });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function getAllUser(req, res) {
  try {
    const newUserDocument = await UserService.getAllUser();

    return res.status(200).send({ result: newUserDocument });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.body;
    let userDocument = await UserService.getUserByEmail(email);
    let user = Object.assign({}, userDocument);
    delete user._doc.password;
    return res.status(config.status_code.OK).send({ user: user._doc });
  } catch (error) {
    return res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

async function updateUserById(req, res) {
  try {
    // const _id = req.userId
    const id = req.body.id;
    const { username, password } = req.body;
    await UserService.updateUserById(id, username, password);

    const userDocument = await UserService.getUserById(id);

    return res.status(config.status_code.OK).send({ user: userDocument });
  } catch (error) {
    res.status(config.status_code.SERVER_ERROR).send({ message: error });
  }
}

module.exports = {
  signIn: signIn,
  signUp: signUp,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  getAllUser: getAllUser,
  getUserByListId: getUserByListId,
  updateUserById: updateUserById,
  getCurrentUser: getCurrentUser,
};
