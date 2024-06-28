const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "Please provide content"],
      maxlength: [170, "Content should be less than 170 characters"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feed: {
      type: mongoose.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
  },
  { timestamps: true },
);

// CommentSchema.statics.calculateCommentLen = async function (feed) {
//   console.log(feed);
// }

// CommentSchema.post('save', async function(){
//   await this.constructor.calculateCommentLen(this.feed)
//   console.log('save');
// })

// CommentSchema.post('remove', async function(){
//   console.log('remove');
// })

module.exports = mongoose.model("Comment", CommentSchema);
