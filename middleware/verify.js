const { User } = require("../models");

const verify = async (req, res, next) => {
  const authHeader = req.headers["x-api-key"];
  
  const userApiKey = await User.findOne({
    where: {
      api_key: authHeader,
    },
  });

  if (!userApiKey) {
    return res
      .status(404)
      .json({ message: "unathorized silahkan registrasi terlebih dahulu" });
  }

  req.headers.data_user = userApiKey;

  next();
};

module.exports = verify;
