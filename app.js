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
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// // passport
// app.use(passport.initialize())
// app.use(passport.session())
const initPassport = require("./strategies/local-strategy");

// middlewares
// Attention: notFoundMiddleware should be placed in the front of errorMiddleware
const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error-handler");
app.use(cors());

app.use(
  expressSession({
    secret: process.env.SESSION_KEY,
    cookie: {
      maxAge: 3000,
    },
    resave: false, // 强制保存session即使它没有变化
    saveUninitialized: true, // 强制将未初始化的session保存
    cookie: { secure: false },
  }),
);

// log the requests
app.use(morgan("tiny"));
// convert json data to object
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());

// routes
app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/feeds", feedRouter);
app.use("/api/v1/comments", commentRouter);

const Port = process.env.PORT || 3007;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(Port, console.log(`Server running on port ${Port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
