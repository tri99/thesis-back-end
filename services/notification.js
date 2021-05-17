const Notification = require("../collections/notification");
const basicCRUDGenerator = require("./basicCRUD");
const notificationCRUD = basicCRUDGenerator(Notification);

const insertNotification = async (text, userId, { type = "info", link }) => {
  const model = notificationCRUD.createModel({
    text,
    userId,
    type,
    link,
    isRead: false,
    cTime: new Date(),
  });
  return notificationCRUD.insert(model);
};
module.exports = {
  ...notificationCRUD,
  insertNotification,
};
