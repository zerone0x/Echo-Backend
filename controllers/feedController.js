const Feeds = require("../models/Feeds");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const { checkPermissions } = require("../utils");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");

const createFeeds = async (req, res) => {
  req.body.user = req.user.userId;
  const feeds = await Feeds.create(req.body);
  sendSuccess(
    res,
    StatusCodes.CREATED,
    feeds,
    "Your feed created successfully",
  );
};

const getAllFeeds = async (req, res) => {
  // let {cursor, limit=10} = req.query;
  // limit = parseInt(limit, 10);

  const AllFeeds = await Feeds.find({}).populate({
    path: "user",
    select: "-password",
  });
  sendSuccess(
    res,
    StatusCodes.CREATED,
    AllFeeds,
    "All feeds fetched successfully",
  );
};

const getFeedById = async (req, res) => {
  try {
    const feed = await Feeds.findById(req.params.id).populate([
      {
        path: "user",
        select: "-password",
      },
      {
        path: "comments",
      },
    ]);
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
  const feeds = await Feeds.find({ user: req.params.userId }).populate(
    "comments",
  );
  sendSuccess(res, StatusCodes.OK, feeds, "Your feeds fetched successfully");
};

const getFeedByUsername = async (req, res) => {
  // try {
  console.log(req.params.username);
  const user = await User.findOne({ name: req.params.username });
  const feeds = await Feeds.find({ user: user._id }).populate([
    {
      path: "user",
      select: "-password",
    },
    {
      path: "comments",
    },
  ]);
  sendSuccess(res, StatusCodes.OK, feeds, "Your feeds fetched successfully");
  // } catch (error) {
  //   console.log(error);
  // }
};

// TODO delete maybe no need to use it
const updateFeedById = async (req, res) => {
  res.send("update by id");
};

const deleteFeedById = async (req, res) => {
  const feed = await Feeds.findById(req.params.id);
  if (!feed) {
    throw new CustomError.NotFoundError("Feed not found");
  }
  checkPermissions(req.user, feed.user);
  await feed.deleteOne();
  sendSuccess(res, StatusCodes.OK, null, "Your feed deleted successfully");
};

const searchFeeds = async (req, res) => {
  res.send("searchFeeds");
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const FeedsImage = req.files.image;
  console.log(FeedsImage);
  if (!FeedsImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image file");
  }
  const maxSize = 1024 * 1024;
  if (FeedsImage.size > maxSize) {
    throw new CustomError.BadRequestError("File size should be less than 1MB");
  }
  const imagePath = path.join(
    __dirname,
    `../public/uploads/${FeedsImage.name}`,
  );
  await FeedsImage.mv(imagePath);
  const image = { image: `/uploads/${FeedsImage.name}` };
  sendSuccess(res, StatusCodes.OK, image, "Your Image uploaded successfully");
};

module.exports = {
  createFeeds,
  getAllFeeds,
  getFeedById,
  getFeedByUserId,
  updateFeedById,
  deleteFeedById,
  uploadImage,
  searchFeeds,
  getFeedByUsername,
};
