const express = require('express')
const router = express.Router()
const {
  createVehicle,
  getVehicle,
  deleteVehicle,
} = require("../db/driver.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.driverID || !data.vehicleType || !data.plateNo || !data.model) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    await createVehicle(data);
    res.status(200).send({ message: "Vehicle Created" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Vehicle Failed!", receivedData: null });
  }
});

router.get("/details", async (req, res) => {
  try {
    const data = await getVehicle(data);
    res.status(200).send({ message: "Driver Details Received", data: data });
  } catch (err) {
    if (err.message === "No record found!")
      return res.status(404).send({ message: err.message, data: null });
    res
      .status(500)
      .send({ message: "Driver Details Req Failed!", data: null });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const data = req.body;

    if (!data.vehicleID) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await deleteVehicle(data);
    res.status(200).send({ message: "Driver Deleted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Driver Deletion failed!", receivedData: null });
  }
});

module.exports = router