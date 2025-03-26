const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { connectDB } = require("./db/config.js")
const authRouter = require("./router/auth.js")
const busRouter = require("./router/bus.js")
const companyRouter = require("./router/company.js")
const driverRouter = require("./router/driver.js")
const userRouter = require("./router/user.js")
const { Server } = require("socket.io");
const http = require("http");


connectDB();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.use("/auth", authRouter)
app.use("/bus", busRouter)
app.use("/company", companyRouter)
app.use("/driver", driverRouter)
app.use("/user", userRouter)


app.get("/", (req, res) => {
  res.send("Hello World!");
});


module.exports = { app, io };

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

