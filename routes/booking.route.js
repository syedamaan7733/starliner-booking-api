const {
  resetBooking,
  createBooking,
  getUserBookings,
} = require("../controllers/booking.controller");
const {
  authenticateUser,
  authorizePermission,
} = require("../midleware/auth.middleware");
const bookingValidation = require("../midleware/bookingValidation.middleware");

const router = require("express").Router();

// Only Admin Can Access this Endpoint
router
  .route("/reset")
  .post([authenticateUser, authorizePermission("admin")], resetBooking);

// Protected Routes For booking creation.
router
  .route("/create-book")
  .post(authenticateUser, bookingValidation, createBooking);

router.route("/get").get(authenticateUser, getUserBookings);

module.exports = router;
