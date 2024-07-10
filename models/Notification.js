const mongoose = require("mongoose");

const ActionEnum = Object.freeze({
  LIKE: "like",
  COMMENT: "comment",
  SHARE: "share",
  FOLLOW: "follow",
});

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: mongoose.Types.ObjectId,
      ref: "Feed",
      required: true,
    },
    action: [
      {
        type: String,
        enum: Object.values(ActionEnum),
        required: true,
      },
    ],
    status: {
      type: String,
      default: "unread",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", NotificationSchema);
