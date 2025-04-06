const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    updated: {
      type: String,
      required: true,
      trim: true,
    },
    seatGuarantee: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const TrainSchema = new Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    trainName: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    departureStation: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalStation: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    classes: [ClassSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Train", TrainSchema);
