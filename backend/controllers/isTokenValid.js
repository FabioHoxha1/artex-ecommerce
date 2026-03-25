const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../errors/customErrorHandler");

const isTokenvalid = async (req, res) => {
  let authHeader = req.headers.authorization;

  // Check if authorization header exists BEFORE trying to split it
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomErrorHandler(401, false);
  }
  
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    throw new CustomErrorHandler(401, false);
  } else {
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, username } = isVerified;
    res.status(200).json({ isTokenValid: true, userId, username });
  }
};

module.exports = isTokenvalid;