const crudServiceGenerator = (model) => {
  const createModel = (newDocument) => {
    return new model(newDocument);
  };
  const insert = (newDocument) => {
    return new Promise((resolve, reject) => {
      newDocument.save((error) => {
        if (error) return reject(error);
        return resolve(true);
      });
    });
  };
  const getById = (_id) => {
    return new Promise((resolve, reject) => {
      model
        .findById(_id)
        .select()
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
        });
    });
  };
  const getAll = (findObject) => {
    return new Promise((resolve, reject) => {
      model
        .find(findObject)
        .select()
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
        });
    });
  };
  const deleteBy = (deleteObject) => {
    return new Promise((resolve, reject) => {
      model.deleteMany(deleteObject).exec((error, result) => {
        if (error) reject(error);
        return resolve(result);
      });
    });
  };
  const updateById = (_id, updatedDocument) => {
    return new Promise((resolve, reject) => {
      model.updateOne({ _id: _id }, updatedDocument).exec((error) => {
        if (error) reject(error);
        return resolve(error);
      });
    });
  };

  const deleteById = (_id) => {
    return deleteBy({ _id });
  };
  return {
    insert,
    getById,
    getAll,
    updateById,
    deleteBy,
    createModel,
    deleteById,
  };
};
module.exports = crudServiceGenerator;
