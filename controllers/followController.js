const Follow = require("../models/Follow");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const { CreateNewNotification } = require("./notificationController");
const { ActionEnum } = require("../utils/data");

const AddFollowing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const idol = await User.findOne({ name: req.body.idolName });
    const idolId = idol._id;
    if (userId === idolId) {
      throw new CustomError.BadRequestError("You cannot follow yourself");
    }
    const existingIdol = await Follow.findOne({
      followed: idolId,
      follower: userId,
    });
    if (existingIdol) {
      const deletedFollow = await Follow.findOneAndDelete({
        followed: idolId,
        follower: userId,
      });
      sendSuccess(
        res,
        StatusCodes.OK,
        deletedFollow,
        "your follow deleted successfully",
      );
      return;
    }
    const followPattern = await Follow.create({
      followed: idolId,
      follower: userId,
    });
    await Notification.create({
      sender: userId,
      receiver: idolId,
      action: ActionEnum.FOLLOW,
    });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      followPattern,
      "your follow created successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.username });
    const following = await Follow.find({ follower: user._id }).populate([
      {
        path: "followed",
        select: "-password -email",
      },
    ]);
    const data = {
      length: following.length,
      ppl: following.map((f) => f.followed),
    };
    sendSuccess(
      res,
      StatusCodes.CREATED,
      data,
      "your following fetched successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getFans = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.username });
    const followedPpl = await Follow.find({ followed: user._id }).populate([
      {
        path: "follower",
        select: "-password -email",
      },
    ]);
    const data = {
      length: followedPpl.length,
      ppl: followedPpl.map((f) => f.follower),
    };
    sendSuccess(
      res,
      StatusCodes.CREATED,
      data,
      "your followedPpl fetched successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getIsFollowed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const username = req.params.username;
    const newPpl = await User.findOne({ name: username });
    const isFollowed = await Follow.findOne({
      followed: newPpl._id,
      follower: userId,
    });
    const result = isFollowed ? true : false;
    sendSuccess(res, StatusCodes.OK, result, `your followed ta`);
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

module.exports = {
  AddFollowing,
  getFollowing,
  getIsFollowed,
  getFans,
};
