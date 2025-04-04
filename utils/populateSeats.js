const Seat = require("../models/Seats");

const initializeSeat = async () => {
  try {
    await Seat.deleteMany(); //clear all the exisiting stuff

    const seat = [];
    let seatNumber = 1;

    for (let row = 1; row <= 12; row++) {
      let seatInRow = row === 12 ? 3 : 7;

      for (let j = 0; j < seatInRow; j++) {
        seat.push({
          seatNumber: seatNumber++,
          rowNumber: row,
        });
      }
    }

    await Seat.insertMany(seat);
    console.log("Initialized seats successfully.");
  } catch (error) {
    console.log("error running inital seat script", error);
  }
};

module.exports = initializeSeat;
