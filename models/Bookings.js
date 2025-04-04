// {
//   _id: ObjectId,
//   userId: ObjectId,
//   seats: [Number], // Array of seat numbers
//   createdAt: Date
// }

const { default: mongoose } = require("mongoose");

const passangerDeail = new mongoose.Schema(
  {
    name: String,
    age: Number,
    gender: String,
  },
  { _id: false }
);

const seatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seats: [Number],
    passangerDetail: [passangerDeail],
    ticketStatus: {
      type: String,
      enums: ["upcomming", "departed"],
      default: "upcomming",
    },
    amount: { type: Number },
  },
  { timestamps: true }
);

seatSchema.pre("save", function (next) {
  try {
    if (!this.seats.length > 0) return next();
    this.amount = this.seats.length * 1100;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = mongoose.model("Booking", seatSchema);
