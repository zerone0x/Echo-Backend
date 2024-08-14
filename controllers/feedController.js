const Feeds = require("../models/Feeds");
const User = require("../models/User");
const Comment = require("../models/Comments");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const BookMark = require("../models/BookMark");
const Likes = require("../models/Likes");
const paginate = require("../utils/paginate");
const Notification = require("../models/Notification");
const { ActionEnum } = require("../utils/data");

const createFeeds = async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);
    }
    const userId = req.user.userId;
    req.body.user = userId;
    req.body.feedImages =
      imageUrls.length > 0 ? imageUrls : req.body.feedImages;
    const type = req.body.type;
    let result;
    if (type === "Feed") {
      result = await Feeds.create(req.body);
    }
    if (type === "Comment") {
      result = await Comment.create(req.body);
      const feedsId = req.body.feed;
      await Feeds.findByIdAndUpdate(feedsId, { $inc: { commentsCount: 1 } });
      const feedUser = await Feeds.findById(feedsId);

      if (userId !== feedUser.user.toString()) {
        await Notification.create({
          sender: userId,
          receiver: feedUser.user,
          action: ActionEnum.COMMENT,
          content: result._id,
          type: type,
        });
      }
    }
    sendSuccess(
      res,
      StatusCodes.CREATED,
      result,
      `Your ${type} has been created successfully`,
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getAllFeeds = async (req, res) => {
  try {
    const paginationOptions = {
      cursorField: "createdAt",
      sort: { createdAt: -1 },
      limit: 10,
      populateOptions: [
        {
          path: "user",
          select: "-password",
        },
      ],
    };
    const paginationResult = await paginate(
      Feeds,
      req.query.cursor,
      paginationOptions,
    );
    sendSuccess(
      res,
      StatusCodes.OK,
      paginationResult,
      "Your feed fetched successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getFeedById = async (req, res) => {
  try {
    const feed = await Feeds.findById(req.params.id)
      .populate([
        {
          path: "user",
          select: "-password",
        },
        {
          path: "comments",
          populate: {
            path: "user",
            select: "-password",
          },
        },
      ])
      .sort({ createdAt: -1 });
    // if (!feed) {
    //   sendFail(res, StatusCodes.NOT_FOUND, null, "Feed not found");
    //   return;
    // }
    sendSuccess(res, StatusCodes.OK, feed, "Your feed fetched successfully");
  } catch (error) {
    sendFail(res, StatusCodes.NOT_FOUND, null, error.message);
  }
};

const getFeedByUserId = async (req, res) => {
  try {
    const feeds = await Feeds.find({ user: req.params.userId })
      .populate("comments")
      .sort({ createdAt: -1 });
    sendSuccess(res, StatusCodes.OK, feeds, "Your feeds fetched successfully");
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const getFeedByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.username });
    const feeds = await Feeds.find({ user: user._id })
      .populate([
        {
          path: "user",
          select: "-password",
        },
        {
          path: "comments",
        },
      ])
      .sort({ createdAt: -1 });
    sendSuccess(res, StatusCodes.OK, feeds, "Your feeds fetched successfully");
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

// TODO delete maybe no need to use it
const updateFeedById = async (req, res) => {
  res.send("update by id");
};

const deleteFeedById = async (req, res) => {
  try {
    const feedId = req.params.id;
    const feed = await Feeds.findById(feedId);

    if (!feed) {
      throw new CustomError.NotFoundError("Feed not found");
    }
    checkPermissions(req.user, feed.user);
    await feed.deleteOne();
    sendSuccess(
      res,
      StatusCodes.OK,
      null,
      "Your feed and related data deleted successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const searchFeeds = async (req, res) => {
  try {
    const keyword = req.body.keyword;
    const feeds = await Feeds.find({
      content: new RegExp(keyword, "i"),
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ createdAt: -1 });
    const user = await User.find({ name: new RegExp(keyword, "i") });
    const comments = await Comment.find({ content: new RegExp(keyword, "i") })
      .populate({
        path: "user",
        select: "-password",
      })
      .sort({ createdAt: -1 });
    const searchRes = { feeds: feeds, user: user, comments: comments };
    sendSuccess(
      res,
      StatusCodes.OK,
      searchRes,
      "Your search result fetched successfully",
    );
  } catch (error) {
    sendFail(res, StatusCodes.INTERNAL_SERVER_ERROR, null, error.message);
  }
};

const uploadImage = async (req) => {
  // if (!req.files || !req.files.image) {
  //   return null;
  // }
  // const FeedsImage = req.files.image;
  // if (!FeedsImage.mimetype.startsWith("image")) {
  //   throw new CustomError.BadRequestError("Please upload an image file");
  // }
  // const maxSize = 1024 * 1024;
  // if (FeedsImage.size > maxSize) {
  //   throw new CustomError.BadRequestError("File size should be less than 1MB");
  // }
  // const imagePath = path.join(
  //   __dirname,
  //   `../public/uploads/${FeedsImage.name}`,
  // );
  // await FeedsImage.mv(imagePath);
  // return `/uploads/${FeedsicImage.name}`;
};

module.exports = {
  createFeeds,
  getAllFeeds,
  getFeedById,
  getFeedByUserId,
  updateFeedById,
  deleteFeedById,
  searchFeeds,
  getFeedByUsername,
};
