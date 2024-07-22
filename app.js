require("dotenv").config();
// apply try catch to async func automatically
require("express-async-errors");
const express = require("express");
const app = express();
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
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const cors = require("cors");
const multer = require("multer");
// // passport
// app.use(passport.initialize())
// app.use(passport.session())
const initPassport = require("./strategies/local-strategy");

// middlewares
// Attention: notFoundMiddleware should be placed in the front of errorMiddleware
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error-handler");
const User = require("./models/User");
const Feeds = require("./models/Feeds");
const BookMark = require("./models/BookMark");
const Likes = require("./models/Likes");
const Notification = require("./models/Notification");
const corsOptions = {
  origin: [process.env.FE_ORIGIN, process.env.FE_STG_ORIGIN],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization", "Content-Type"], // Explicitly allow these headers
};
app.use(cors(corsOptions));

// app.use(
//   expressSession({
//     secret: process.env.SESSION_KEY,
//     cookie: {
//       maxAge: 3000,
//       // secure: process.env.NODE_ENV === "production",
//       // sameSite: "None",
//       // partitioned: true,
//     },
//     resave: false,
//     saveUninitialized: true,
//   }),
// );

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

const Port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // const deletedBookMarks = await BookMark.deleteMany({});
    // console.log(`Deleted ${deletedBookMarks.deletedCount} bookmarks.`);

    // // 删除Likes集合中的所有数据
    // const deletedLikes = await Likes.deleteMany({});
    // console.log(`Deleted ${deletedLikes.deletedCount} likes.`);
    //     const newImageUrl = "https://res.cloudinary.com/curbyouraction/image/upload/v1720602855/EchoAPP/667feb793c4a91620183595c-1720602850859.png";

    // const result = await User.updateMany(
    //   {}, // filter for all documents
    //   { $set: { Banner: newImageUrl } } // update operation
    // );
    const feedCount = await Feeds.countDocuments({});
    const notificationsCount = await Notification.countDocuments({});
    console.log(`Total feeds: ${feedCount}`);
    console.log(`Notifications Count: ${notificationsCount}`);
    // console.log(result); // This will log the outcome of the update operation
    app.listen(Port, console.log(`Server running on port ${Port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
