const Seat = require("../models/Seats");
const Bookings = require("../models/Bookings");

// function to get all available  seats from the row in sorted order
async function getAvailableSeatsInRow(row) {
  return await Seat.find({ rowNumber: row, status: "available" })
    .sort({ seatNumber: 1 })
    .lean();
}

//main function to allocated seats whjen requested seats are not fitted in single row
async function allocateCloserSeats(requestedSeats) {
  // Step 1: Getting sll the availavle seats by row
  const availableSeatsByRow = [];
  for (let rowNum = 1; rowNum <= 12; rowNum++) {
    availableSeatsByRow[rowNum] = await getAvailableSeatsInRow(rowNum);
  }

  //Step 2: Find the point where we can allocate the mmaximum seats
  let bestNumRow = 1;
  let maxAvailable = 0; // help to get maximum
  for (let rowNum = 1; rowNum <= 12; rowNum++) {
    if (availableSeatsByRow[rowNum].length > maxAvailable) {
      maxAvailable = availableSeatsByRow[rowNum].length;
      bestNumRow = rowNum;
    }
  }

  //   Step 3: Now we allocate seats starting from the bestRow and go both side untill all requested seats are booked.
  const allocatedSeats = [];
  let remainingSeats = requestedSeats;

  //   this function will return the chain of bestRows which is physically closer to main Best Rows
  const rowChain = createExpandingRowChain(bestNumRow);

  while (remainingSeats > 0 && rowChain.hasNext()) {
    const currentRow = rowChain.next();
    const availableInRow = availableSeatsByRow[currentRow] || [];

    const seatToTake = Math.min(availableInRow.length, remainingSeats);

    if (seatToTake > 0) {
      allocatedSeats.push(
        ...availableInRow.slice(0, seatToTake).map((seat) => seat.seatNumber)
      );
      remainingSeats -= seatToTake;
    }
    //removing the allocated seat from available
    availableSeatsByRow[currentRow] = availableInRow.slice(seatToTake);
  }
  return allocatedSeats;
}

function createExpandingRowChain(centerRow) {
  // new order array which will store all rows sequential closer to center row
  const rowOrder = [centerRow];

  let distance = 1;
  // this loop will add the all close - far rows into the array
  while (centerRow + distance <= 12 || centerRow - distance >= 1) {
    if (centerRow + distance <= 12) rowOrder.push(centerRow + distance);
    if (centerRow - distance >= 1) rowOrder.push(centerRow - distance);
    distance++;
  }

  let index = 0;

  return {
    next: () => rowOrder[index++],
    hasNext: () => index < rowOrder.length,
  };
}

async function getAllocatedSeats(requestedSeats) {
  // Case 1 : Looking for all seats in one row inself.

  //   (11 row * 7 seats ) + 3 seats  = 80 seats

  for (let rowNum = 1; rowNum <= 12; rowNum++) {
    const availableRow = await getAvailableSeatsInRow(rowNum);
    if (availableRow.length >= requestedSeats) {
      return availableRow
        .slice(0, requestedSeats)
        .map((seat) => seat.seatNumber);
    }
  }
  // Case2 : if we don't find the row seats >= requested_seats in the whole coach
  return await allocateCloserSeats(requestedSeats);
}


module.exports = getAllocatedSeats