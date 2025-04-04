const { default: mongoose } = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: Number,
  rowNumber: Number,
  status: {
    type: String,
    enums: ["available", "booked"],
    default: "available",
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
});

module.exports = mongoose.model("Seat", seatSchema);
