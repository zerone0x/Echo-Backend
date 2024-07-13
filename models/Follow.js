const mongoose = require("mongoose");
const { ActionEnum } = require("../utils/data");

const FollowSchema = new mongoose.Schema(
  {
    followed: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

FollowSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function (next) {
    const query = this.getQuery();
    const followed = query.followed;
    const follower = query.follower;
    await mongoose.model("Notification").deleteMany({ action: ActionEnum.FOLLOW, receiver: followed, sender: follower });
    next();
  },
);

module.exports = mongoose.model("Follow", FollowSchema);
