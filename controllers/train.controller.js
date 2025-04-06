const Train = require("../models/Trains");

const createTrain = async (req, res) => {
  try {
    const { train } = req.body;

    if (!train) {
      return res.status(400).json({
        success: false,
        message: "plesse provide the valid body ",
      });
    }

    const newTrain = await Train.create(req.body);

    res.status(201).json({ success: true, train: newTrain });

    res.json(newTrain);
  } catch (error) {
    console.error(`Error in Creation Train: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllTrain = async (req, res) => {
  try {
    const trains = await Train.find();

    if (trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No trains found ",
      });
    }

    res.status(200).json({ success: true, trains });
  } catch (error) {
    console.error(`Error in Getting Train: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getTrainByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide the train ID. ",
      });
    }

    const train = await Train.findById({ _id: id });

    if (!train) {
      return res.status(404).json({
        success: false,
        message: "No train found ",
      });
    }

    res.status(200).json({ success: true, train });
  } catch (error) {
    console.error(`Error in Getting Train By Id: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = { createTrain, getAllTrain, getTrainByID };
