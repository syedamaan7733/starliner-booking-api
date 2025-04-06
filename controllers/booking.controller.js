const initializeSeat = require("../utils/populateSeats");
const Seat = require("../models/Seats");
const Bookings = require("../models/Bookings");
const getAllocatedSeats = require("../utils/bookingAlgo");
const Train = require("../models/Trains");

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
    const { requestedSeats, passanger_details, trainId } = req.body;
    const { _id: id } = req.user;

    const train = await Train.findOne({ _id: trainId });

    if (!train) {
      return res.status(404).json({
        success: false,
        message: "No trains found ",
      });
    }

    // getting all allocated Seats
    const allocatedSeats = await getAllocatedSeats(requestedSeats);

    const booking = new Bookings({
      userId: id,
      seats: [...allocatedSeats],
      passangerDetail: [...passanger_details],
      train: train._id,
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

    const userBooking = await Bookings.find({ userId: id }).populate({
      path: "train",
    });

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

// Getting available seats
const getAvailableSeats = async (req, res) => {
  try {
    const availableSeats = await Seat.countDocuments({ status: "available" });
    res.status(200).json({ success: true, availableSeats });
  } catch (error) {
    console.error(`Error in get available seats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Getting All Seats.
const getAllSeats = async (req, res) => {
  const allSeats = await Seat.find();
  res.status(200).json({ success: true, seats: allSeats });
  try {
  } catch (error) {
    console.error(`Error in getting all the seats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  resetBooking,
  createBooking,
  getUserBookings,
  getAvailableSeats,
  getAllSeats,
};
