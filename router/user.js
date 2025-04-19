const express = require("express");
const router = express.Router();
const {
  ChangeUsername,
  ChangeUserPhoneNo,
  GetUserBusses,
  GetUserRides,
  ChangeUserPassword,
  getUserData,
} = require("../db/user.js");
const { validateToken } = require("../middleware/auth.js");
router.use(validateToken);

router.put("/change/name", async (req, res) => {
  try {
    const data = req.body;
    data.userId = req.id;
    if (!data.firstName || !data.lastName || !data.userId) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    await ChangeUsername(data);

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

    data.userId = req.id;
    if (!data.phoneNumber || !data.userId) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    await ChangeUserPhoneNo(data);

    res.status(200).send({ message: "Phone changed" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Phone change Failed!", receivedData: null });
  }
});

router.put("/change/password", async (req, res) => {
  try {
    const data = req.body;
    data.userId = req.id;
    if (!data.password || !data.userId) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    await ChangeUserPassword(data);

    res.status(200).send({ message: "Password changed" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Password change Failed!", receivedData: null });
  }
});

router.get("/buses", async (req, res) => {
  try {
    const data = { userId: req.id };
    const recievedData = await GetUserBusses(data);

    res.status(200).send({ message: "User Busses Sent", data: recievedData });
  } catch (err) {
    if (err.message === "No record found!")
      return res.status(404).send({ message: err.message, data: null });
    res.status(500).send({ message: "Req Failed!", data: null });
  }
});

router.get("/rides", async (req, res) => {
  try {
    const data = { userId: req.id };
    const recievedData = await GetUserRides(data);

    res.status(200).send({ message: "User Rides Sent", data: recievedData });
  } catch (err) {
    if (err.message === "No record found!")
      return res.status(404).send({ message: err.message, data: null });
    res.status(500).send({ message: "Req Failed!", data: null });
  }
});

router.get("/data", async (req, res) => {
  try {
  
    const recievedData = await getUserData(req.id);
  
    res.status(200).send({ message: "User Rides Sent", data: recievedData });
  } catch (err) {
    if (err.message === "No record found!")
      return res.status(404).send({ message: err.message, data: null });

    
    res.status(500).send({ message: "Req Failed!", data: null });
  }
});

module.exports = router;
