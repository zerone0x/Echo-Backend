const Likes = require("../models/Likes");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const { checkPermissions } = require("../utils");
const { sendSuccess } = require("../utils/FormatResponse");

const CreateLikesFeed = async (req, res) => {
  res.send("likes your tweet");
};

const CreateLikesComment = async (req, res) => {
  res.send("like your comment");
};

module.exports = {
  CreateLikesFeed,
  CreateLikesComment,
};
