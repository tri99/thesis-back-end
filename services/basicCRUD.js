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
  const updateManyBy = (filterOption, updateOption) => {
    return new Promise((resolve, reject) => {
      model.updateMany(filterOption, updateOption).exec((error, result) => {
        if (error) reject(error);
        return resolve(result);
      });
    });
  };
  const findOneBy = (findOption, selectOption = "_id") => {
    return new Promise((resolve, reject) => {
      return model
        .findOne(findOption)
        .select(selectOption)
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
        });
    });
  };
  const findBy = (findOption, extra) => {
    const query = model.find(findOption);
    if (extra) {
      const { select, sort } = extra;
      if (select) query.select(select);
      if (sort) query.sort(sort);
    }
    return query.exec();
  };
  let findByPipeLine = (pipeline, selectOption = "_id") => {
    console.log(pipeline);
    return new Promise((resolve, reject) => {
      return model
        .find(pipeline)
        .select(selectOption)
        .exec((error, document) => {
          if (error) return reject(error);
          return resolve(document);
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
    updateManyBy,
    deleteBy,
    createModel,
    deleteById,
    findOneBy,
    findBy,
    findByPipeLine,
  };
};
module.exports = crudServiceGenerator;
