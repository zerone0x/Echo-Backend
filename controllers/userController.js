const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const authenticateUser = require("../middlewares/authentication");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getUserByName = async (req, res) => {
  const username = req.params.username;
  const user = await User.findOne({ role: "user", name: username }).select(
    "-password",
  );
  if (!user) {
    sendFail(res, StatusCodes.NOT_FOUND, null, "User not found");
  }
  sendSuccess(res, StatusCodes.OK, user, "This user fetched successfully");
};

const addFollowers = async (req, res) => {
  const followerId = req.user.userId;
  const { idolId } = req.body;
  if (idolId === followerId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You can't follow yourself" });
  }
  const user = await User.findById(idolId);
  if (!user.Followers.includes(followerId)) {
    user.Followers.push(followerId);
    await user.save();
  }
  const follower = await User.findById(followerId);
  if (!follower.Following.includes(idolId)) {
    follower.Following.push(idolId);
    await follower.save();
  }
  res.status(StatusCodes.OK).json({ msg: "Success! Followers Added." });
};

const RemoveFollowers = async (req, res) => {};

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
  const token = req.cookies.token;
  if(!token){
    throw new CustomError.BadRequestError("Please login or signup");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  sendSuccess(
    res,
    StatusCodes.OK,
    decoded,
    "Your currUser fetched successfully",
  );
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("Please provide email and name");
  }
  console.log(req.user);
  const user = await User.findOne({ _id: req.user.userId });
  user.name = name;
  user.email = email;
  await user.save();
  // const user = await User.findOneAndUpdate({_id: req.user._id}, {email, name}, {new: true, runValidators: true})
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPwd = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ email: email });

  console.log("user===============", user);
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
  addFollowers,
  RemoveFollowers,
  updateUserPwd,
};
