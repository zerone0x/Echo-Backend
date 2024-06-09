const Feeds = require("../models/Feeds");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

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
  const AllFeeds = await Feeds.find({});
  sendSuccess(
    res,
    StatusCodes.CREATED,
    AllFeeds,
    "All feeds fetched successfully",
  );
};

const getFeedById = async (req, res) => {
  const feed = await Feeds.findById(req.params.id).populate("comments");
  if (!feed) {
    throw new CustomError.NotFoundError("Feed not found");
  }
  sendSuccess(res, StatusCodes.OK, feed, "Your feed fetched successfully");
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
  updateFeedById,
  deleteFeedById,
  uploadImage,
  searchFeeds,
};
