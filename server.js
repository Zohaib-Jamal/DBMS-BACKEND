const express = require("express");
const { sql, connectDB } = require("./db");
const cors = require("cors");
const app = express();
const port = 3000;


app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Express + Nodemon Server");
});


app.get("/users", async (req, res) => {
  try {
    const result = await sql.query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
