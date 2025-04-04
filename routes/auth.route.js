const router = require("express").Router();

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { authenticateUser } = require("../midleware/auth.middleware");


// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Protected routes
router.get("/me", authenticateUser, getMe);

module.exports = router;
