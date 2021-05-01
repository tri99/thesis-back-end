const userPermGroup = require("../collections/userPermissionGroup");
const basicCRUDGenerator = require("./basicCRUD");
const userPermGroupCRUD = basicCRUDGenerator(userPermGroup);

module.exports = {
  ...userPermGroupCRUD,
};
