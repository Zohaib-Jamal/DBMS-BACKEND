//const { app } = require("../server.js");
const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../db/user.js");
const {
  createDriver,
  loginDriverEmail,
  loginDriverPhone,
} = require("../db/driver.js");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { validateToken } = require("../middleware/auth.js");



const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN, { expiresIn: "1d" });
};


const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN, {
    expiresIn: "30d",
});
};



router.post("/user/signup", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.dob ||
      !data.password ||
      !data.phoneNumber
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }

   
    const userid = await createUser(data);

    const access_token = generateAccessToken(userid, "User");
    const refresh_token = generateRefreshToken(userid, "User");

    res.status(200).send({
      message: "Signup successful!",
      data,
      access_token,
      refresh_token,
    });

    
  } catch (err) {
    if (err.message === "User already exists.") {
      return res
        .status(400)
        .send({ message: "User Already Exists!", data: null });
    }
    // console.log(err);
    res.status(500).send({ message: "Signup Failed!", data: null });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.password) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    const userData = await loginUser(data);

    const access_token = generateAccessToken(userData.UserID, "User");
    const refresh_token = generateRefreshToken(userData.UserID, "User");

    res
      .status(200)
      .send({
        message: "Login Successfull!",
        data: userData,
        access_token,
        refresh_token,
      });

   
  } catch (err) {
    ///console.log(err);
    res.status(401).send({ message: err.message, receivedData: null });
  }
});

router.post("/driver/login/email", async (req, res) => {
  try {
    console.log("drive logging")
    const data = req.body;
    if (!data.email || !data.password) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const driverData = await loginDriverEmail(data);

    const access_token = generateAccessToken(driverData.DriverID, "Driver");
    const refresh_token = generateRefreshToken(driverData.DriverID, "Driver");

    res
     
      .send({ message: "Login Successfull!", data: driverData, access_token,refresh_token });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Login  Failed!", receivedData: null });
  }
});

router.post("/driver/login/phone", async (req, res) => {
  try {
    const data = req.body;
    if (!data.phoneNumber || !data.password) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const driverData = await loginDriverPhone(data);

    const access_token = generateAccessToken(driverData.DriverID, "Driver");
    const refresh_token = generateRefreshToken(driverData.DriverID, "Driver");

    res
      .cookie("refreshToken", refresh_token, { httpOnly: true })
      .status(200)
      .send({ message: "Login Successfull!", data: driverData, access_token });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Login  Failed!", receivedData: null });
  }
});

router.post("/driver/signup", async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.dob ||
      !data.password ||
      !data.phoneNumber ||
      !data.cnic
    ) {
      return res.status(400).send({ message: "Missing required fields" });
    }
    const driverData = await createDriver(data);

    const access_token = generateAccessToken(driverData.driverId, "Driver");
    const refresh_token = generateRefreshToken(driverData.driverId, "Driver");

    res.status(200)
      .send({ message: "Signup Successful!", data: driverData, access_token,refresh_token });
  } catch (err) {
    if (err.message === "Driver already exists.") {
      return res
        .status(400)
        .send({ message: "Driver Already Exists!", data: null });
    }
    // console.log(err);
    res.status(500).send({ message: "Signup Failed!", data: null });
  }
});

router.post("/create_vehicle", validateToken, async (req, res) => {
  try {
    vehicleData;
    const data = req.body;
    await createVehicle(data);

    res.status(200).send({ message: "Vehicle Added!", data: data });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Create Vehicle Failed!", receivedData: null });
  }
});

router.post("/refresh_token", async (req, res) => {
  try {
    const refresh_token = req.body.refresh_token; 

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN); 
    if (decoded) {
      const id = decoded.id;
      const role = decoded.role;

      const access_token = generateAccessToken(id, role);
     
      res.status(200).send({ access_token, role });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).send({ message: "An Error Occured!" });
  }
});

module.exports = router;
