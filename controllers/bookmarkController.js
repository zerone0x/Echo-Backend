const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const Feeds = require("../models/Feeds");
const User = require("../models/User");
const BookMark = require("../models/BookMark");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

const BookMarkFeed = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.body.feedId;
    const existingBookmark = await BookMark.findOne({
      user: userId,
      feed: feedId,
    });
    if (existingBookmark) {
      const bookmark = await BookMark.findOneAndDelete({
        user: userId,
        feed: feedId,
      });
      sendSuccess(
        res,
        StatusCodes.OK,
        bookmark,
        "Feed unbookmarked successfully",
      );
      return;
    }
    const bookmark = await BookMark.create({ user: userId, feed: feedId });
    sendSuccess(
      res,
      StatusCodes.CREATED,
      bookmark,
      "Feed bookmarked successfully",
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || "Failed to bookmark feed",
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
      bookmarks,
      "Bookmarks fetched successfully",
    );
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER).send({
      message: error.message || "Failed to fetch bookmarks",
    });
  }
};

const getIsBooked = async (req, res) => {
  try {
    const userId = req.user.userId;
    const feedId = req.params.feedId;
    const isBooked = await BookMark.findOne({ user: userId, feed: feedId });
    const result = isBooked ? true : false;
    sendSuccess(res, StatusCodes.OK, result, `your feed book status`);
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: error.message || "Failed to fetch your feed",
    });
  }
};

module.exports = {
  BookMarkFeed,
  CancelBookMarkFeed,
  getIsBooked,
  getAllBookmarksByUserId,
};
