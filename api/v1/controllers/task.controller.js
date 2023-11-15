const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  //Bộ lọc
  if (req.query.status) {
    find.status = req.query.status;
  }
  //Hết bộ lọc

  // Sort
  const sort = {};
  const optionSort = ["desc", "asc"];
  if (req.query.sortKey && req.query.sortValue && req.query.sortValue.includes(optionSort)) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort
  
  const tasks = await Task.find(find).sort(sort);
  res.json(tasks);
};

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const tasks = await Task.findOne({
    _id: id,
    deleted: false,
  });
  res.json(tasks);
};
