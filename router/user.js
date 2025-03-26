const express = require("express");
const router = express.Router();
const {
  ChangeUsername,
  ChangeUserPhoneNo,
  GetUserBusses,
  GetUserRides,
  ChangeUserPassword,
} = require("../db/user.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.put("/change/name", async (req, res) => {
  try {
    const data = req.body;
    await ChangeUsername(data);

    res.status(200).send({ message: "Name changed" });
  } catch {
    console.log(err);
    res
      .status(500)
      .send({ message: "Username change Failed!", receivedData: null });
  }
});

router.put("/change/phone", async (req, res) => {
  try {
    const data = req.body;
    await ChangeUserPhoneNo(data);

    res.status(200).send({ message: "Phone changed" });
  } catch {
    console.log(err);
    res
      .status(500)
      .send({ message: "Phone change Failed!", receivedData: null });
  }
});

router.put("/change/password", async (req, res) => {
  try {
    const data = req.body;
    await ChangeUserPassword(data);

    res.status(200).send({ message: "Password changed" });
  } catch {
    console.log(err);
    res
      .status(500)
      .send({ message: "Password change Failed!", receivedData: null });
  }
});

router.get("/bus", async (req, res) => {
  try {
    const data = await GetUserBusses();

    res.status(200).send({ message: "User Busses Sent", data: data });
  } catch {
    console.log(err);
    res.status(500).send({ message: "Req Failed!", data: null });
  }
});

router.get("/Bus", async (req, res) => {
  try {
    const data = await GetUserRides();

    res.status(200).send({ message: "User Rides Sent", data: data });
  } catch {
    console.log(err);
    res.status(500).send({ message: "Req Failed!", data: null });
  }
});

module.exports = router;
