const mongoose = require("mongoose");

const FeedsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "Please provide content"],
      maxlength: [1000, "Content should be less than 1000 characters"],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

FeedsSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "feed",
  justOne: false,
});

FeedsSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const query = this.getQuery();
    const feedId = query._id;
    if (feedId) {
      await mongoose.model("Comment").deleteMany({ feed: feedId });
    }
    next();
  },
);

module.exports = mongoose.model("Feed", FeedsSchema);
