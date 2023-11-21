const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generate = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại",
    });
    return;
  }
  const infoUser = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    token: generate.generateRandomString(30),
  };

  const user = new User(infoUser);
  await user.save();
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Đăng kí thành công",
    token: token,
  });
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }
  if (md5(password) != user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu",
    });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: token,
  });
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại",
    });
    return;
  }
  const otp = generate.generateRandomNumber(8);
  const timeExpire = 5;
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60*1000,
  };
  //Viec 1 : Luu vao DB
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  forgotPassword.save();
  //Viec 2 : gui otp qua email
  const subject = "Mã OTP xác minh láy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b>.
                 Thời gian sử dụng là ${timeExpire} phút`;
  sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: 200,
    message: "Đã gửi mã OTP thành công",
  });
};

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ",
    });
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("token", user.token);
  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công",
    token: user.token,
  });
};

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;

  const user = await User.findOne({
    token: token,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "User không tồn tại",
    });
    return;
  }
  if (md5(password) == user.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ",
    });
    return;
  }
  await User.updateOne({
    token: token,
  },{
   password : md5(password)
  });
  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công",
  });
};

// [GET] /api/v1/users/detail/:id
module.exports.detail = async (req, res) => {

  res.json({
    code: 200,
    message: "Detail profile",
    info: req.user,
  });
}