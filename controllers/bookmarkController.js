const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const Feeds = require("../models/Feeds");
const User = require("../models/User");
const BookMark = require("../models/BookMark");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");
const Comments = require("../models/Comments");

const BookMarkFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.body.feedId;
    const itemType = req.body.itemType;
    const existingBookmark = await BookMark.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    if (existingBookmark) {
      const bookmark = await BookMark.findOneAndDelete({
        user: userId,
        bookmarkedItem: feedId,
        type: itemType,
      });
      sendSuccess(
        res,
        StatusCodes.OK,
        bookmark,
        `${itemType} unbookmarked successfully`,
      );
      return;
    }
    const bookmark = await BookMark.create({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    let feedDetails;
    if (itemType === "Comment") {
      feedDetails = await Comments.findById(feedId);
    } else {
      feedDetails = await Feeds.findById(feedId);
    }
    sendSuccess(
      res,
      StatusCodes.CREATED,
      bookmark,
      `${itemType} bookmarked successfully`,
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const CancelBookMarkFeed = async (req, res) => {
  res.send("bookmark cancelled");
};

const getAllBookmarksByUserId = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookmarks = await BookMark.find({ user: userId })
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
      bookmarks,
      `Bookmarks fetched successfully`,
    );
  } catch (error) {
    // TODO refactor by this
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getIsBooked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const itemType = req.params.itemType;
    const isBooked = await BookMark.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    const result = !!isBooked;
    sendSuccess(res, StatusCodes.OK, result, `your ${itemType} book status`);
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};
module.exports = {
  BookMarkFeed,
  CancelBookMarkFeed,
  getIsBooked,
  getAllBookmarksByUserId,
};
