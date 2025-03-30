const express = require('express')
const router = express.Router()
const {
  AllCompanies,
  LocationBusses,
  CompanyBusses
} = require("../db/company.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.get("/", async (req, res) => {
  try {
    const data = await AllCompanies();

    res.status(200).send({ message: "Companies Sent", data: data });
  } catch (err) {
    console.log(err);
    if (err.message === "No record found!") {
      return res
        .status(404)
        .send({ message: "No record found!", data: null });
    }
    res
      .status(500)
      .send({ message: "Req Failed!", data: null });
  }
})

router.get("/location", async (req, res) => {
  try {
    const data = { departureLocation: req.query.departure, arrivalLocation: req.query.arrival }
    const recievedData = await LocationBusses(data);
    res.status(200).send({ message: "Busses Sent", data: recievedData });
  } catch (err) {
    console.log(err)
    if (err.message === "No record found!") {
      return res
        .status(404)
        .send({ message: "No record found!", data: null });
    }
    res
      .status(500)
      .send({ message: "Req Failed!", data: null });
  }
})

router.get("/bus", async (req, res) => {
  try {
    const data = {
      departureLocation: req.query.departure,
      arrivalLocation: req.query.arrival,
      companyID: req.query.cid
    }
    const busdata = await CompanyBusses(data);
    res.status(200).send({ message: "Busses Sent", data: busdata });
  } catch (err) {
    console.log(err);
    if (err.message === "No record found!") {
      return res
        .status(404)
        .send({ message: "No record found!", data: null });
    }
    res
      .status(500)
      .send({ message: "Req Failed!", data: null });
  }
})

module.exports = router