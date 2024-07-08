const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const Feeds = require("../models/Feeds");
const User = require("../models/User");
const BookMark = require("../models/BookMark");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

const BookMarkFeed = async (req, res) => {};

module.exports = {
  BookMarkFeed,
  CancelBookMarkFeed,
  getIsBooked,
  getAllBookmarksByUserId,
};
