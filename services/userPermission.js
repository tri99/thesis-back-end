const UserPerm = require("../collections/userPermission");
const basicCRUDGenerator = require("./basicCRUD");
const UserPermCRUD = basicCRUDGenerator(UserPerm);

function getUserPermissions(
  findObject,
  firstPopulateObject,
  secondPopulateObject
) {
  return new Promise((resolve, reject) => {
    UserPerm.find(findObject)
      .populate(firstPopulateObject)
      .populate(secondPopulateObject)
      .exec((error, documents) => {
        if (error) return reject(error);
        const firstPath = firstPopulateObject.path;
        const secondPath = secondPopulateObject.path;
        const pluralSecondPath = `${secondPath}s`;
        const map = new Map();
        const result = [];
        try {
          documents.forEach((doc) => {
            console.log(doc, firstPath, secondPath);
            console.log(doc[firstPath]._id, typeof doc[firstPath]._id);
            const key = doc[firstPath]._id.toString();

            const newSecondPathItem = doc[secondPath];

            newSecondPathItem.relationId = doc._id;
            if (!map.has(key)) {
              map.set(key, {
                [firstPath]: doc[firstPath],
                [pluralSecondPath]: [newSecondPathItem],
              });
            } else {
              map.get(key)[pluralSecondPath].push(newSecondPathItem);
            }
          });
          for (const [key] of map.entries()) {
            result.push(map.get(key));
          }
          console.log("result:", result);
          return resolve(result);
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
  });
}

function getBySubuserId(userId) {
  return getUserPermissions(
    { user: userId },
    { path: "zone", select: "_id name" },
    { path: "permissionGroup", select: "_id name" }
  );
}
module.exports = {
  ...UserPermCRUD,
  getBySubuserId,
};
