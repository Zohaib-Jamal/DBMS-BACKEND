const express = require("express");
const { sql, connectDB, createUser } = require("./db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
connectDB();

app.post("/login", async (req, res) => {
  const data = req.body;

  if (!data.username || !data.password) {
    res.status(400).send("Invalid req");
  }

  console.log("username", data.username);
  console.log("password", data.password);

  await createUser(data);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
