const Likes = require("../models/Likes");
const Feed = require("../models/Feeds");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");

const LikeFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.body.feedId;
    const itemType = req.body.itemType;
    const existingLikes = await Likes.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    if (existingLikes) {
      const likesFeeds = await Likes.findOneAndDelete({
        user: userId,
        bookmarkedItem: feedId,
        type: itemType,
      });
      if (itemType === "Feed") {
        await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: -1 } });
      }
      if (itemType === "Comment") {
        await Comment.findByIdAndUpdate(feedId, { $inc: { likesCount: -1 } });
      }
      sendSuccess(res, StatusCodes.OK, likesFeeds, "Feed unliked successfully");
      return;
    }
    const likesFeeds = await Likes.create({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    if (itemType === "Feed") {
      await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
    }
    if (itemType === "Comment") {
      await Comment.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
    }
    const feedDetails = await Feed.findById(feedId);
    const feedUser = feedDetails.user;
    await Notification.create({
      sender: userId,
      receiver: feedUser,
      content: feedId,
      type: itemType,
      action: ActionEnum.LIKE,
    });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      likesFeeds,
      `${itemType} liked successfully`,
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || `Failed to like ${itemType}`,
    });
  }
};

const getIsLiked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const itemType = req.body.itemType;
    const isLiked = await Likes.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    const result = !!isLiked;
    sendSuccess(res, StatusCodes.OK, result, `your ${itemType} like status`);
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || `Failed to fetch your ${itemType}`,
    });
  }
};

const getAllLikesByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const likeFeeds = await Likes.find({ user: userId })
      .populate({
        path: "bookmarkedItem",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .sort({ createdAt: -1 });

    sendSuccess(
      res,
      StatusCodes.OK,
      likeFeeds,
      `${itemType} feeds fetched successfully`,
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER).send({
      message: error.message || `Failed to fetch ${itemType} feeds`,
    });
  }
};

const CreateLikesComment = async (req, res) => {
  res.send("like your comment");
};

module.exports = {
  LikeFeed,
  CreateLikesComment,
  getIsLiked,
  getAllLikesByUserId,
};
