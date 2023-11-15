const Task = require("../models/task.model");

const paginationHelper  = require("../../../helpers/pagination");
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
  // Pagination
  const countTasks = await Task.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2,
    },
    req.query,
    countTasks
  );

  //End Pagination
  // Sort
  const sort = {};
  const optionSort = ["desc", "asc"];
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  // End Sort

  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
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
