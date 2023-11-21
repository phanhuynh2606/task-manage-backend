const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    const user = await User.findOne({
      token: token,
      deleted: false,
    });
    if (!user) {
      res.json({
        code: 403,
        message: "Không có quyền truy cập",
      });
    } else {
      req.user  = user
      next();
    }
  } else {
    res.json({
      code: 403,
      message: "Không có quyền truy cập",
    });
  }
};
