const userPermZone = require("../collections/userPermission");
function getUserPermissions(
  findObject,
  firstPopulateObject,
  secondPopulateObject
) {
  return new Promise((resolve, reject) => {
    userPermZone
      .find(findObject)
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

            const key = doc[firstPath]._id.toString();

            let newSecondPathItem = {};
            for (const key of secondPopulateObject["select"].split(" ")) {
              newSecondPathItem[key] = doc[secondPath][key];
            }
            newSecondPathItem = { ...newSecondPathItem, relationId: doc._id };
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
module.exports = getUserPermissions;
