const Seat = require("../models/Seats");

const bookingValidation = async (req, res, next) => {
  try {
    const { requestedSeats } = req.body;

    // requested seat not be more than 7
    if (requestedSeats > 7) {
      return res.status(400).json({
        success: false,
        message: "maximun booking seat limit is 7.",
      });
    }
    // get available seat count
    const availableSeatCount = await Seat.countDocuments({
      status: "available",
    });
    console.log("Seats left :", availableSeatCount);

    // if we don't have seats left for processing the request we respond here.
    if (requestedSeats > availableSeatCount) {
      return res.status(400).json({
        success: false,
        message: `Booking request terminated. Only ${availableSeatCount} seats left.`,
      });
    }
    next()
  } catch (error) {
    console.error(`Bokking validation error: ${error.message}`);
    return res.status(400).json({
      success: false,
      message: "Booking Invalidate",
    });
  }
};

module.exports = bookingValidation;
