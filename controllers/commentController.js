const Comment = require("../models/Comments");
const Feeds = require("../models/Feeds");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");

const getAllComments = async (req, res) => {
  try {
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
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getCommentById = async (req, res) => {
  try {
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
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
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
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const deleteCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      throw new CustomError.NotFoundError("Comment not found");
    }
    checkPermissions(req.user, comment.user);
    await comment.deleteOne();
    await Feeds.findByIdAndUpdate(comment.feed, {
      $inc: { commentsCount: -1 },
    });
    sendSuccess(res, StatusCodes.OK, null, "Your Comment deleted successfully");
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

module.exports = {
  deleteCommentById,
  getAllComments,
  getCommentById,
  getCommentsByFeedID,
};
