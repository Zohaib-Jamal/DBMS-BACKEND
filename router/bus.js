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

    const data = await ReservationData(data);
    res.status(200).send({ message: "Reservations Sent", data: data });
  } catch {
    console.log(err);
    res.status(500).send({ message: "Reservations Req failed!", data: null });
  }
});

router.post("/reserveSeat", async (req, res) => {
  try {
    const data = req.body;
    journeyID, seatNumber, userId
    if (!data.journeyID || !data.seatNumber || !data.userId) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    await ReserveSeat(data);

    res.status(200).send({ message: "Seat Reserved" });
  } catch {
    console.log(err);
    res
      .status(500)
      .send({ message: "Seat Reservation failed!", receivedData: null });
  }
});

router.delete("/cancelSeat", async (req, res) => {
  try {
    const data = req.body;
    await CancelSeat(data);

    req.status(200).send({ message: "Seat Unreserved" });
  } catch {
    console.log(err);
    res
      .status(500)
      .send({ message: "Seat Cancellation failed!", receivedData: null });
  }
});

router.get("/availableSeats", async (req, res) => {
  try {
    const data = await AvailableSeats(data);
    req.status(200).send({ message: "Seats Sent", data: data });
  } catch {
    console.log(err);
    res.status(500).send({ message: "Seats Req failed!", data: null });
  }
});

module.exports = router;
