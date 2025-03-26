const express = require('express')
const router = express.Router()
const {
    AllCompanies,
    LocationBusses,
    CompanyBusses
} = require("../db/company.js");
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)

router.get("/", async (req, res)=>{
    try {
      const data = await AllCompanies();

      res.status(200).send({ message: "Comapnies Sent", data:data });
    } catch {
      console.log(err);
      res
        .status(500)
        .send({ message: "Req Failed!", data: null });
    }
  })

  router.get("/location", async (req, res)=>{
    try {
      const data = await LocationBusses();
      res.status(200).send({ message: "Busses Sent", data:data });
    } catch {
      console.log(err);
      res
        .status(500)
        .send({ message: "Req Failed!", data: null });
    }
  })

  router.get("/bus", async (req, res)=>{
    try {
      const data = await CompanyBusses();
      res.status(200).send({ message: "Busses Sent", data:data });
    } catch {
      console.log(err);
      res
        .status(500)
        .send({ message: "Req Failed!", data: null });
    }
  })

  module.exports = router