const User = require("../models/Users");
const Seat = require("../models/Seats");
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * process.env.COOKIE_EXPIRE,
  };
  const { name, email, role, _id } = user;
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: { name, email, role, id: _id },
    });
};

//Register User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required inputs.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error(`Error in register: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Login user

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    2;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Log user out
const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000), //expiry
    });

    res.status(200).json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    console.error(`Error in logout: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//  Get current logged in user

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(`Error in getMe: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { register, login, logout, getMe };
