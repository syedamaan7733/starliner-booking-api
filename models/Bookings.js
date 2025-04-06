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
      enums: ["upcomming", "departed", "cancelled"],
      default: "upcomming",
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    amount: { type: Number },
  },
  { timestamps: true }
);

seatSchema.pre("save", function (next) {
  try {
    if (!this.seats.length > 0) return next();
    this.amount = this.seats.length * 1200;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = mongoose.model("Booking", seatSchema);
