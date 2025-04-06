const {
  createTrain,
  getAllTrain,
  getTrainByID,
} = require("../controllers/train.controller");
const {
  authenticateUser,
  authorizePermission,
} = require("../midleware/auth.middleware");

const router = require("express").Router();

router
  .route("/create")
  .post([authenticateUser, authorizePermission("admin")], createTrain);

router.route("/").get(getAllTrain);
router.route("/:id").get(getTrainByID);

module.exports = router;
