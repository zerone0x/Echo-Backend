const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

const LikeFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.body.feedId;
    const existingLikes = await Likes.findOne({
      user: userId,
      feed: feedId,
    });
    if (existingLikes) {
      const likesFeeds = await Likes.findOneAndDelete({
        user: userId,
        feed: feedId,
      });
      await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: -1 } });
      sendSuccess(res, StatusCodes.OK, likesFeeds, "Feed unliked successfully");
      return;
    }
    const likesFeeds = await Likes.create({ user: userId, feed: feedId });
    await Feed.findByIdAndUpdate(feedId, { $inc: { likesCount: 1 } });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      likesFeeds,
      "Feed liked successfully",
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || "Failed to like feed",
    });
  }
};

const getIsLiked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const isLiked = await Likes.findOne({ user: userId, feed: feedId });
    const result = isLiked ? true : false;
    sendSuccess(res, StatusCodes.OK, result, `your feed like status`);
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || "Failed to fetch your feed",
    });
  }
};

const getAllLikesByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const likeFeeds = await Likes.find({ user: userId })
      .populate({
        path: "feed",
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
      "likeFeeds fetched successfully",
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER).send({
      message: error.message || "Failed to fetch likeFeeds",
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
