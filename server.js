const express = require("express");
const cors = require("cors");

const app = express();

const port = 3000;
const { connectDB, createUser, checkUser } = require("./db.js");

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    await createUser(data);
    console.log(data);
    res.send({ message: "Signup successful!", receivedData: data });
  } catch (err) {}
});

app.post("/login", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const userData = await checkUser(data);
    console.log(userData);
    res.status(200).send({ message: "Login successful!", receivedData: userData });
  } catch (err) {
    console.log(err)
    res.status(401).send({ message: "Login  Failed!", receivedData: null })
  }
});
