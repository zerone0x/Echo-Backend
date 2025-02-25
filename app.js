require("dotenv").config();
// apply try catch to async func automatically
require("express-async-errors");
const express = require("express");
const { app, server } = require("./utils/socket");
const passport = require("passport");
const morgan = require("morgan");
const connectDB = require("./db/connect");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const feedRouter = require("./routes/feedRoute");
const commentRouter = require("./routes/commentRoute");
const bookmarkRouter = require("./routes/bookmarkRoute");
const likesRouter = require("./routes/likesRoute");
const followRouter = require("./routes/followRoute");
const notificationRouter = require("./routes/notificationRoute");
const msgRouter = require("./routes/messageRoute");
const conversationRouter = require("./routes/conversationRoute");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");
const initPassport = require("./strategies/local-strategy");
const rateLimit = require("express-rate-limit");
// middlewares
// Attention: notFoundMiddleware should be placed in the front of errorMiddleware
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error-handler");
const User = require("./models/User");
const Feeds = require("./models/Feeds");
const BookMark = require("./models/BookMark");
const Follow = require("./models/Follow");
const Likes = require("./models/Likes");
const Notification = require("./models/Notification");
const Comment = require("./models/Comments");
const Conversation = require("./models/Conversation");
const corsOptions = {
  origin: [process.env.FE_ORIGIN, process.env.FE_STG_ORIGIN],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"],
};
app.use(cors(corsOptions));

app.use(
  expressSession({
    secret: process.env.SESSION_KEY,
    cookie: {
      maxAge: 3000,
      secure: true,
      sameSite: "None",
      partitioned: true,
    },
    resave: false,
    saveUninitialized: true,
  })
);

// log the requests
app.use(morgan("tiny"));
// convert json data to object
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
app.get("/", (req, res) => {
  res.send("ECHO BackEnd");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/feeds", feedRouter);
app.use("/api/v1/like", likesRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/bookmark", bookmarkRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/message", msgRouter);
app.use("/api/v1/conversation", conversationRouter);
const Port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const feedCount = await Feeds.countDocuments({});
    const notificationsCount = await Notification.countDocuments({});

    console.log(`Total feeds: ${feedCount}`);
    console.log(`Notifications Count: ${notificationsCount}`);
    server.listen(Port, console.log(`Server running on port ${Port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
