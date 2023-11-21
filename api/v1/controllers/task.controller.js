const Task = require("../models/task.model");

const paginationHelper = require("../../../helpers/pagination");
const SearchHelper = require("../../../helpers/search");

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

  //Search
  const objectSearch = SearchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End Search

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
  try {
    const id = req.params.id;
    const tasks = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(tasks);
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công",
    });
  }
};

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const listStatus = ["initial", "doing", "notFinish", "finish"];
    const id = req.params.id;
    const status = req.body.status;
    if (listStatus.includes(status)) {
      await Task.updateOne(
        {
          _id: id,
        },
        {
          status: status,
        }
      );
      res.json({
        code: 200,
        message: "Cập nhật trạng thái thành công",
      });
    } else {
      res.json({
        code: 400,
        message: "Cập nhật trạng thái không thành công",
        error: "status not format",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công",
    });
  }
};

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany({ _id: { $in: ids } }, { status: value });
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công",
        });
        break;
      case "deleted":
        await Task.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date() });
        res.json({
          code: 200,
          message: "Xoá thành công",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Cập nhật trạng thái không thành công",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công",
    });
  }
};

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo không thành công",
    });
  }
};

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật không thành công",
    });
  }
};

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      { _id: id },
      {
        deleted: true,
        deleteAt: new Date(),
      }
    );
    res.json({
      code: 200,
      message: "Xoá thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xoá không thành công",
    });
  }
};
