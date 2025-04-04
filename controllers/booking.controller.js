const initializeSeat = require("../utils/populateSeats");
const Seat = require("../models/Seats");
const Bookings = require("../models/Bookings");
const getAllocatedSeats = require("../utils/bookingAlgo");

const resetBooking = async (req, res) => {
  try {
    //   console.log(req.user.role);
    await initializeSeat();
    const invalidateBooking = await Bookings.updateMany(
      {},
      { $set: { ticketStatus: "departed" } }
    );
    // if (req.user.role === "admin") {
    // } else {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized to access this route",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Seat has been initialized sucessfully.",
    });
  } catch (error) {
    console.error(`Error in resetBooking: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//  Processing the booking POST protected Rpute
const createBooking = async (req, res) => {
  try {
    const { requestedSeats, passanger_details } = req.body;
    const { _id: id } = req.user;

    // getting all allocated Seats
    const allocatedSeats = await getAllocatedSeats(requestedSeats);

    const booking = new Bookings({
      userId: id,
      seats: [...allocatedSeats],
    });

    const confirmBooking = await Seat.updateMany(
      { seatNumber: { $in: booking.seats } },
      { $set: { status: "booked", bookedBy: id, bookingId: booking._id } }
    );

    await booking.save();

    res.json({ success: true, message: "Bookind Successful.", booking });
  } catch (error) {
    console.error(`Error in createBooking: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Getting All tickets detail of the User
const getUserBookings = async (req, res) => {
  try {
    const { _id: id } = req.user;

    const userBooking = await Bookings.find({ userId: id });

    console.log(userBooking);

    res.json({ userBooking });
  } catch (error) {
    console.error(`Error in : ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = { resetBooking, createBooking, getUserBookings };
