const {
  resetBooking,
  createBooking,
  getUserBookings,
  getAvailableSeats,
  getAllSeats,
} = require("../controllers/booking.controller");
const {
  authenticateUser,
  authorizePermission,
} = require("../midleware/auth.middleware");
const bookingValidation = require("../midleware/bookingValidation.middleware");

const router = require("express").Router();

//Public Route
router.route("/available").get(getAvailableSeats);

// Only Admin Can Access this Endpoint
router
  .route("/reset")
  .post([authenticateUser, authorizePermission("admin")], resetBooking);

// Protected Routes For booking creation.
router.route("/train/all-seats").get(authenticateUser, getAllSeats);
router
  .route("/create-book")
  .post(authenticateUser, bookingValidation, createBooking);

router.route("/user-get").get(authenticateUser, getUserBookings);

module.exports = router;
