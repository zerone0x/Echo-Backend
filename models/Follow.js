const mongoose = require("mongoose");

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

module.exports = mongoose.model("Follow", FollowSchema);
