const { StatusCodes } = require("http-status-codes");
const { sendSuccess, sendFail } = require("../utils/FormatResponse");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { BadRequestError, NotFoundError } = require("../errors");
const User = require("../models/User");

const SendMessage = async (req, res) => {
  const { receiverName, message } = req.body;
  const senderId = req.user.userId;

  // Input validation
  if (!receiverName || !message || !message.trim()) {
    throw new BadRequestError("Please provide both receiver name and message");
  }

  // Find receiver
  const receiver = await User.findOne({ name: receiverName });
  if (!receiver) {
    throw new NotFoundError(`No user found with name: ${receiverName}`);
  }

  // Create new message
  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiver._id,
    message: message.trim(),
    status: "sent",
  });

  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiver._id] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiver._id],
      messages: [newMessage._id],
      lastMessage: newMessage._id,
      unreadCount: 1,
    });
  } else {
    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;
    conversation.unreadCount += 1;
    await conversation.save();
  }

  // Populate message details for response
  const populatedMessage = await Message.findById(newMessage._id)
    .populate("sender", "name email")
    .populate("receiver", "name email");

  sendSuccess(
    res,
    StatusCodes.CREATED,
    populatedMessage,
    "Message sent successfully"
  );
};

const GetAllMessages = async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  // Base query
  let query = { participants: req.user.userId };

  // If cursor is provided, get conversations older than the cursor
  if (cursor) {
    query.updatedAt = { $lt: new Date(cursor) };
  }

  // Get conversations with cursor pagination
  const conversations = await Conversation.find(query)
    .sort({ updatedAt: 1 })
    .limit(limit + 1) // Get one extra to determine if there are more results
    .populate({
      path: "lastMessage",
      populate: [
        { path: "sender", select: "name email" },
        { path: "receiver", select: "name email" },
      ],
    })
    .populate("participants", "name email avatar");

  // Check if there are more results
  const hasMore = conversations.length > limit;
  // Remove the extra item we used to check for more results
  const conversationsToReturn = hasMore
    ? conversations.slice(0, -1)
    : conversations;

  // Calculate unread counts and format conversation data
  const conversationsWithDetails = await Promise.all(
    conversationsToReturn.map(async (conv) => {
      const unreadCount = await Message.countDocuments({
        _id: { $in: conv.messages },
        receiver: req.user.userId,
        status: "sent",
      });

      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== req.user.userId
      );

      return {
        _id: conv._id,
        otherParticipant,
        lastMessage: conv.lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    })
  );

  const responseData = {
    conversations: conversationsWithDetails,
    pagination: {
      hasMore,
      nextCursor: hasMore
        ? conversationsToReturn[
            conversationsToReturn.length - 1
          ].updatedAt.toISOString()
        : null,
    },
  };

  sendSuccess(
    res,
    StatusCodes.OK,
    responseData,
    "Conversations fetched successfully"
  );
};

const GetMessagesOfConversation = async (req, res) => {
  const { receiverName } = req.params;
  const { cursor, limit = 50 } = req.query;
  const senderId = req.user.userId;

  // Find receiver
  const receiver = await User.findOne({ name: receiverName });
  if (!receiver) {
    throw new NotFoundError(`No user found with name: ${receiverName}`);
  }

  // Find conversation between current user and receiver
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiver._id] },
  });

  if (!conversation) {
    return sendSuccess(
      res,
      StatusCodes.OK,
      {
        messages: [],
        participants: [],
        pagination: { hasMore: false, nextCursor: null },
      },
      "No messages found"
    );
  }

  // Base query
  let query = { _id: { $in: conversation.messages } };

  // If cursor is provided, get messages older than the cursor
  if (cursor) {
    const cursorMessage = await Message.findById(cursor);
    if (cursorMessage) {
      query.createdAt = { $lt: cursorMessage.createdAt };
    }
  }

  // Get messages with cursor pagination
  const messages = await Message.find(query)
    .sort({ createdAt: 1 }) // Sort by newest first
    .limit(limit + 1)
    .populate("sender", "name email ProfileImage")
    .populate("receiver", "name email ProfileImage");

  // Check if there are more results
  const hasMore = messages.length > limit;
  // Remove the extra item we used to check for more results
  const messagesToReturn = hasMore ? messages.slice(0, -1) : messages;

  // Add isCurrentUser field to each message
  const messagesWithCurrentUser = messagesToReturn.map((message) => {
    const messageObj = message.toObject();
    messageObj.isCurrentUser =
      message.sender._id.toString() === req.user.userId;
    return messageObj;
  });

  // Update unread messages to delivered status
  await Message.updateMany(
    {
      _id: { $in: conversation.messages },
      receiver: req.user.userId,
      status: "sent",
    },
    { status: "delivered" }
  );

  // Get conversation participants
  const participants = await User.find(
    { _id: { $in: conversation.participants } },
    "name email ProfileImage"
  );

  const responseData = {
    messages: messagesWithCurrentUser,
    participants: participants,
    pagination: {
      hasMore,
      nextCursor: hasMore
        ? messagesToReturn[messagesToReturn.length - 1]._id.toString()
        : null,
    },
  };

  sendSuccess(
    res,
    StatusCodes.OK,
    responseData,
    "Messages fetched successfully"
  );
};

module.exports = {
  SendMessage,
  GetAllMessages,
  GetMessagesOfConversation,
};
