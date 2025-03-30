const express = require("express");
const router = express.Router();
const {
  ReservationData,
  ReserveSeat,
  CancelSeat,
  AvailableSeats,
} = require("../db/bus.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.get("/reservations", async (req, res) => {
  try {
    const data = { userId: req.id }
    const recievedData = await ReservationData(data);
    res.status(200).send({ message: "Reservations Sent", data: recievedData });
  } catch (err) {

    if (err.message === "No record found!")
      return res.status(404).send({ message: err.message, data: null });
    res.status(500).send({ message: "Reservations Req failed!", data: null });
  }
});

router.post("/reserve", async (req, res) => {
  try {
    const data = req.body;
    data.userId = req.id

    if (!data.journeyID || !data.seatNumber || !data.userId) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await ReserveSeat(data);

    res.status(200).send({ message: "Seat Reserved" });
  } catch (err) {
    if (err.message === "Journey does not Exists!") {
      return res
        .status(404)
        .send({ message: err.message, data: null });
    }
    else if (err.message === "Seat Already Booked!")
      return res
        .status(400)
        .send({ message: err.message, data: null });
    res
      .status(500)
      .send({ message: "Seat Reservation failed!", data: null });
  }
});

router.delete("/cancel", async (req, res) => {
  try {
    const data = req.body;
    if (!data.seatID)
      return res.status(400).send({ message: "Missing required fields" });
    await CancelSeat(data);

    res.status(200).send({ message: "Seat Unreserved" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Seat Cancellation failed!", receivedData: null });
  }
});

router.get("/available", async (req, res) => {
  try {
    const data = { journeyID: req.query.journeyID }
    if (!data.journeyID)
      return res.status(400).send({ message: "Missing required fields" });
    const receivedData = await AvailableSeats(data);
    res.status(200).send({ message: "Seats Sent", data: receivedData });
  } catch (err) {

    if (err.message === "Journey Does Not Exists!" || err.message === "No record found!")
      return res
        .status(404)
        .send({ message: err.message, data: null });

    res.status(500).send({ message: "Seats Req failed!", data: null });
  }
});

module.exports = router;
