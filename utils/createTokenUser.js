const createTokenUser = (user) => {
  const tokenUser = {
    name: user.name,
    email: user.email,
    role: user.role,
    userId: user._id,
  };
  return tokenUser;
};

module.exports = {
  createTokenUser,
};
