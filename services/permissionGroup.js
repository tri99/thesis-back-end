const PermGroup = require("../collections/permissionGroup");
const basicCRUDGenerator = require("./basicCRUD");
const permGroupCRUD = basicCRUDGenerator(PermGroup);

module.exports = permGroupCRUD;
