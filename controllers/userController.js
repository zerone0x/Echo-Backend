const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const authenticateUser = require("../middlewares/authentication");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
  isTokenValid,
} = require("../utils");
const { CreateNewNotification } = require("./notificationController");
const { Notification, ActionEnum } = require("../models/Notification");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getUserByName = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ name: username }).select("-password");
    sendSuccess(res, StatusCodes.OK, user, "This user fetched successfully");
  } catch (error) {
    sendFail(res, StatusCodes.UNAUTHORIZED, error.message, error.message);
  }
};

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrUser = async (req, res) => {
  // const currUser = { user: req.user };
  try {
    const token = req.signedCookies.token;
    // if(!token){
    //   throw new CustomError.BadRequestError("Please login or signup");
    // }
    const decoded = isTokenValid(token);
    sendSuccess(
      res,
      StatusCodes.OK,
      decoded,
      "Your currUser fetched successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.UNAUTHORIZED, error.message, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }
    if (req.files["ProfileImage"] && req.files["ProfileImage"][0]) {
      user.ProfileImage = req.files["ProfileImage"][0].path;
    }
    if (req.files["Banner"] && req.files["Banner"][0]) {
      user.Banner = req.files["Banner"][0].path;
    }
    user.username = username;
    user.Bio = bio;
    await user.save();
    sendSuccess(
      res,
      StatusCodes.OK,
      user,
      "Your user detail updated successfully",
    );
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Error updating user", error: error.message });
  }
};

const updateUserPwd = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ email: email });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

module.exports = {
  getAllUsers,
  getUserByName,
  getSingleUser,
  showCurrUser,
  updateUser,
  updateUserPwd,
};
