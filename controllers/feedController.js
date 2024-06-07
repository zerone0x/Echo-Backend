const createFeeds = async (req, res) => {
  res.send("create");
};

const getAllFeeds = async (req, res) => {
  res.send("get all");
};

const getFeedById = async (req, res) => {
  res.send("get by id");
};

const updateFeedById = async (req, res) => {
  res.send("update by id");
};

const deleteFeedById = async (req, res) => {
  res.send("delete by id");
};

const uploadImage = async (req, res) => {
  res.send("upload image");
};

module.exports = {
  createFeeds,
  getAllFeeds,
  getFeedById,
  updateFeedById,
  deleteFeedById,
  uploadImage,
};
