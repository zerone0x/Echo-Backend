const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const day = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + day),
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    partitioned: true,
    signed: true,
  }); 
  return token
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
