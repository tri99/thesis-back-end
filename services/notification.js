const Notification = require("../collections/notification");
const basicCRUDGenerator = require("./basicCRUD");
const notificationCRUD = basicCRUDGenerator(Notification);
const socketService = require("../socket");
const insertNotification = async (text, userId, extra = {}) => {
  const { type = "info", link = "#", receiverId = userId } = extra;
  const model = notificationCRUD.createModel({
    text,
    userId,
    type,
    link,
    isRead: false,
    cTime: new Date(),
  });
  return notificationCRUD
    .insert(model)
    .then((noti) =>
      socketService.getIO().in(receiverId.toString()).emit("notification", noti)
    );
};
module.exports = {
  ...notificationCRUD,
  insertNotification,
};
