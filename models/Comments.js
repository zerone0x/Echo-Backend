const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      maxlength: [170, "Content should be less than 170 characters"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    feed: {
      type: mongoose.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    feedImages: [
      {
        type: String,
        default: null,
      },
    ],
    type: {
      type: String,
      default: "Comment",
    },
  },
  { timestamps: true },
);

CommentSchema.pre("save", function (next) {
  if (!this.content && !this.feedImage) {
    next(new Error("Please provide either content or an image"));
  } else {
    next();
  }
});
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
