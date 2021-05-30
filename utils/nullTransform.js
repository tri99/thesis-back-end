function nullTransform(doc, id) {
  //   console.log("cool");
  return doc == null ? { _id: id, name: "Deleted" } : doc;
}
module.exports = nullTransform;
