const mongoose = require("mongoose");
const { ActionEnum } = require("../utils/data");

const BookMarkSchema = new mongoose.Schema(
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

BookMarkSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const query = this.getQuery();
    const user = query.user;
    const bookmarkedItem = query.bookmarkedItem;
    if (bookmarkedItem) {
      await mongoose.model("Notification").deleteMany({ action: ActionEnum.BOOKMARK, sender: user, content: bookmarkedItem });
    }
    next();
  },
);

module.exports = mongoose.model("BookMark", BookMarkSchema);
