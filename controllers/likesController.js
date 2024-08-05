const Likes = require("../models/Likes");
const Feed = require("../models/Feeds");
const Comment = require("../models/Comments");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");

const GetCountOfLikes = async (req, res) => {
  try {
    const feedId = req.params.feedId;
    const itemType = req.params.itemType;
    const likeCount = await Likes.countDocuments({
      bookmarkedItem: feedId,
      type: itemType,
    });

    sendSuccess(
      res,
      StatusCodes.OK,
      likeCount,
      `get count of ${itemType} likes`,
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

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
      sendSuccess(res, StatusCodes.OK, likesFeeds, "Feed unliked successfully");
      return;
    }
    const likesFeeds = await Likes.create({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    let feedDetails;
    if (itemType === "Feed") {
      await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
      feedDetails = await Feed.findById(feedId);
    }
    if (itemType === "Comment") {
      await Comment.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
      feedDetails = await Comment.findById(feedId);
    }
    const feedUser = feedDetails.user;
    if (userId != feedUser) {
      await Notification.create({
        sender: userId,
        receiver: feedUser,
        content: feedId,
        type: itemType,
        action: ActionEnum.LIKE,
      });
    }

    sendSuccess(
      res,
      StatusCodes.CREATED,
      likesFeeds,
      `${itemType} liked successfully`,
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getIsLiked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const itemType = req.params.itemType;
    const isLiked = await Likes.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    const result = !!isLiked;
    sendSuccess(res, StatusCodes.OK, result, `your ${itemType} like status`);
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
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
      `liked feeds fetched successfully`,
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
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
  GetCountOfLikes,
};
