const crudServiceGenerator = (model) => ({
  createModel(newDocument) {
    return new model(newDocument);
  },
  insert(newDocument) {
    return new Promise((resolve, reject) => {
      newDocument.save((error) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  },
  getById(_id) {
    return new Promise((resolve, reject) => {
      model
        .findById(_id)
        .select()
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
        });
    });
  },
  getAll(findObject) {
    return new Promise((resolve, reject) => {
      model
        .find(findObject)
        .select()
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
        });
    });
  },
  deleteById(_id) {
    return new Promise((resolve, reject) => {
      model.deleteMany({ _id: _id }).exec((error) => {
        if (error) reject(error);
        return resolve(true);
      });
    });
  },
  updateById(_id, updatedDocument) {
    return new Promise((resolve, reject) => {
      model.updateOne({ _id: _id }, updatedDocument).exec((error) => {
        if (error) reject(error);
        return resolve(error);
      });
    });
  },
});
module.exports = crudServiceGenerator;
