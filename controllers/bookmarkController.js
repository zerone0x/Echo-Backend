const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const Feeds = require("../models/Feeds");
const User = require("../models/User");
const BookMark = require("../models/BookMark");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");

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
    const feedDetails = await Feeds.findById(feedId);
    const feedUser = feedDetails.user;
    await Notification.create({
      sender: userId,
      receiver: feedUser,
      content: feedId,
      type: itemType,
      action: ActionEnum.BOOKMARK,
    });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      bookmark,
      `${itemType} bookmarked successfully`,
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || `Failed to bookmark ${itemType}`,
    });
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
      `${itemType} Bookmarks fetched successfully`,
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER).send({
      message: error.message || `Failed to fetch ${itemType} bookmarks`,
    });
  }
};

const getIsBooked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const itemType = req.body.itemType;
    const isBooked = await BookMark.findOne({
      user: userId,
      bookmarkedItem: feedId,
      type: itemType,
    });
    const result = !!isBooked;
    sendSuccess(res, StatusCodes.OK, result, `your ${itemType} book status`);
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || `Failed to fetch your ${itemType}`,
    });
  }
};

module.exports = {
  BookMarkFeed,
  CancelBookMarkFeed,
  getIsBooked,
  getAllBookmarksByUserId,
};
