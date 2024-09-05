const mongoose = require("mongoose");
const { ActionEnum } = require("../utils/data");

const LikesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookmarkedItem: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "type",
    },
    type: {
      type: String,
      required: true,
      enum: ["Comment", "Feed"],
    },
  },
  {
    timestamps: true,
  },
);

LikesSchema.pre("save", async function (next) {
  try {
    const existingLike = await mongoose.model("Likes").findOne({
      user: this.user,
      bookmarkedItem: this.bookmarkedItem,
      type: this.type,
    });

    if (existingLike) {
      const err = new Error("This like already exists.");
      return next(err);
    }
    next();
  } catch (err) {
    next(err);
  }
});

LikesSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function (next) {
    const query = this.getQuery();
    const user = query.user;
    const bookmarkedItem = query.bookmarkedItem;
    if (bookmarkedItem) {
      await mongoose.model("Notification").deleteMany({
        action: ActionEnum.LIKE,
        sender: user,
        content: bookmarkedItem,
      });
    }
    next();
  },
);

module.exports = mongoose.model("Likes", LikesSchema);
