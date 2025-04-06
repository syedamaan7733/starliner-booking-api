const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// auth middleware for protected route
const authenticateUser = async (req, res, next) => {  
  //getting token either from headers or cookie
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  // check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from database to request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error(`Auth middleware error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized to access this route.",
        });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
