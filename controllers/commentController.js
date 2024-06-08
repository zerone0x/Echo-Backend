const Comment = require('../models/Comments');
const Feeds = require('../models/Feeds');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path')
const {
    checkPermissions,
  } = require("../utils");

const createComments = async (req, res) => {
  req.body.user = req.user.userId;
  const feedsId = req.body.feed;
//   TODO 感觉不需要check 
  const isValidComment = await Feeds.findOne({ _id: feedsId }) 
  if(!isValidComment){
    throw new CustomError.NotFoundError("Feed not found")
  }
  const comments= await Comment.create(req.body)
  res.status(StatusCodes.CREATED).json({comments});
};

const getAllComments = async(req,res) =>{
    const comments = await Comment.find({}).populate({path:'feed', select: 'content'})
    res.status(StatusCodes.OK).json({comments, count:comments.length})
}

const getCommentById = async(req,res) =>{
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        throw new CustomError.NotFoundError("Comment not found");
    }
    res.status(StatusCodes.OK).json({ comment });
}

const deleteCommentById = async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        throw new CustomError.NotFoundError("Comment not found");
    }
    checkPermissions(req.user, comment.user)
    await comment.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
};

module.exports = {
    createComments,
    deleteCommentById,
    getAllComments,
    getCommentById
}