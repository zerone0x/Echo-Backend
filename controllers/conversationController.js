const { StatusCodes } = require("http-status-codes");
const Conversation = require("../models/Conversation");
const { sendSuccess } = require("../utils/FormatResponse");

const getAllConversations = async (req, res) => {
  const hostId = req.user.userId;
  const conversations = await Conversation.find({
    participants: { $in: hostId },
  });

  sendSuccess(
    res,
    StatusCodes.OK,
    conversations,
    "Conversations fetched successfully"
  );
};

const getConversationDetails = async (req, res) => {
  const hostId = req.user.userId;

  try {
    const conversations = await Conversation.find({
      participants: { $in: [hostId] },
    })
      .populate({
        path: "lastMessage",
        select: "message createdAt unreadCount",
      })
      .populate({
        path: "participants",
        select: "name email ProfileImage",
      });

    const formattedConversations = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== hostId
      );
      const currentUser = conv.participants.find(
        (p) => p._id.toString() === hostId
      );
      return {
        conversationId: conv._id,
        otherUsername: otherUser ? otherUser.name : currentUser.name,
        otherUserAvatar: otherUser
          ? otherUser.ProfileImage
          : currentUser.ProfileImage,
        unreadCount: conv.unreadCount,
        lastMessage: conv.lastMessage ? conv.lastMessage.message : null,
        lastMessageTime: conv.lastMessage ? conv.lastMessage.createdAt : null,
      };
    });

    sendSuccess(
      res,
      StatusCodes.OK,
      formattedConversations,
      "Conversation details fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching conversation details:", error);
    throw error;
  }
};

module.exports = {
  getAllConversations,
  getConversationDetails,
};
