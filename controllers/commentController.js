const Comment = require("../models/Comments");
const Feeds = require("../models/Feeds");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

const createComments = async (req, res) => {
  req.body.user = req.user.userId;
  const feedsId = req.body.feed;
  //   TODO 感觉不需要check
  const isValidComment = await Feeds.findOne({ _id: feedsId });
  if (!isValidComment) {
    throw new CustomError.NotFoundError("Feed not found");
  }
  const comments = await Comment.create(req.body);
  await Feeds.findByIdAndUpdate(feedsId, { $inc: { commentsCount: 1 } });
  sendSuccess(
    res,
    StatusCodes.CREATED,
    comments,
    "Your comment created successfully",
  );
};

const getAllComments = async (req, res) => {
  const comments = await Comment.find({}).populate({
    path: "feed",
    select: "content",
  });
  const resComment = { comments: comments, count: comments.length };
  sendSuccess(
    res,
    StatusCodes.OK,
    resComment,
    "All comments fetched successfully",
  );
};

const getCommentById = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found");
  }
  sendSuccess(
    res,
    StatusCodes.OK,
    comment,
    "Your comment fetched successfully",
  );
};

const getCommentsByFeedID = async (req, res) => {
  try {
    const comments = await Comment.find({ feed: req.params.feedId }).populate({
      path: "user",
      select: "-password",
    });
    sendSuccess(
      res,
      StatusCodes.OK,
      comments,
      "Your comments fetched successfully",
    );
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};

const deleteCommentById = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    throw new CustomError.NotFoundError("Comment not found");
  }
  checkPermissions(req.user, comment.user);
  await comment.deleteOne();
  await Feeds.findByIdAndUpdate(comment.feed, { $inc: { commentsCount: -1 } });
  sendSuccess(res, StatusCodes.OK, null, "Your Comment deleted successfully");
};

module.exports = {
  createComments,
  deleteCommentById,
  getAllComments,
  getCommentById,
  getCommentsByFeedID,
};
