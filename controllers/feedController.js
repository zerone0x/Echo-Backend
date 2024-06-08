const Feeds = require('../models/Feeds');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path')
const {
  checkPermissions,
} = require("../utils");

const createFeeds = async (req, res) => {
  req.body.user = req.user.userId;
  const feeds = await Feeds.create(req.body)
  res.status(StatusCodes.CREATED).json(feeds);
};

const getAllFeeds = async (req, res) => {
  const AllFeeds = await Feeds.find({});
  res.status(StatusCodes.OK).json({ AllFeeds });
};

const getFeedById = async (req, res) => {
  const feed = await Feeds.findById(req.params.id).populate('comments');
  if (!feed) {
    throw new CustomError.NotFoundError("Feed not found");
  }
  res.status(StatusCodes.OK).json({ feed });
};

const updateFeedById = async (req, res) => {
  res.send("update by id");
};

const deleteFeedById = async (req, res) => {
  const feed = await Feeds.findById(req.params.id);
  if (!feed) {
    throw new CustomError.NotFoundError("Feed not found");
  }
  checkPermissions(req.user, feed.user)
  await feed.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Feed deleted successfully" });
};

const searchFeeds = async (req, res) => {
  res.send('searchFeeds')
}

const uploadImage = async (req, res) => {
  if(!req.files){
    throw new CustomError.BadRequestError('No File Uploaded')
  }
  const FeedsImage = req.files.image 
  console.log(FeedsImage);
  if(!FeedsImage.mimetype.startsWith('image')){
    throw new CustomError.BadRequestError('Please upload an image file')
  }
  const maxSize = 1024 * 1024
  if(FeedsImage.size > maxSize){
    throw new CustomError.BadRequestError('File size should be less than 1MB')
  }
  const imagePath = path.join(__dirname, `../public/uploads/${FeedsImage.name}` )
  await FeedsImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ msg: "Image Uploaded successfully", image: `/uploads/${FeedsImage.name}` });
};

module.exports = {
  createFeeds,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
  uploadImage,
  searchFeeds
};
