const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;
const { connectDB, createUser, checkUser } = require("./db.js");

module.exports = { app };

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});

