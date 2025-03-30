const express = require('express')
const router = express.Router()
const {
  ChangeDriverPassword,
  ChangeDriverPhoneNo,
  ChangeDrivername,
  GetDriverHistory,
  getDriver
} = require("../db/driver.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.put("/change/name", async (req, res) => {
  try {
    const data = req.body;
    data.driverID = req.id
    if (!data.firstName || !data.lastName || !data.driverID) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await ChangeDrivername(data);
    res.status(200).send({ message: "Name changed" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Username change Failed!", receivedData: null });
  }
});

router.put("/change/phone", async (req, res) => {
  try {
    const data = req.body;
    data.driverID = req.id
    if (!data.phoneNumber || !data.driverID) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await ChangeDriverPhoneNo(data);
    res.status(200).send({ message: "Phone changed" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Phone Number change Failed!", receivedData: null });
  }
});

router.put("/change/password", async (req, res) => {
  try {
    const data = req.body;
    data.driverID = req.id
    if (!data.password || !data.driverID) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await ChangeDriverPassword(data);
    res.status(200).send({ message: "Password changed" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Password change Failed!", receivedData: null });
  }
});

router.get("/details", async (req, res) => {
  try {
    const data = { driverID: req.id }

    const recievedData = await getDriver(data);
    res.status(200).send({ message: "Driver Data Sent", data: recievedData });
  } catch (err) {
    if (err.message === "Could not Find Driver")
      return res
        .status(404)
        .send({ message: err.message, data: null });
    res
      .status(500)
      .send({ message: "Data Req Failed!", data: null });
  }
});

router.get("/history", async (req, res) => {
  try {
    const data = { driverID: req.id }
    const recievedData = await GetDriverHistory(data);
    res.status(200).send({ message: "History Sent", data: recievedData });
  } catch (err) {
    if (err.message === "No record found!")
      return res
        .status(404)
        .send({ message: err.message, data: null });
    res
      .status(500)
      .send({ message: "Data Req Failed!", data: null });
  }
});

module.exports = router