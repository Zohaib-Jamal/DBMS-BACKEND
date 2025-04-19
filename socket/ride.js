const { io } = require("../server");
var jwt = require("jsonwebtoken");
const {
  createRide,
  cancelRide,
  completeRide,
  getRideData,
} = require("../db/ride");
require("dotenv").config();
let users = {};
let drivers = {};
let activeRides = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const token = socket.handshake.query.token;
  console.log(token);

  if (!token) {
    console.log("No token provided, disconnecting...");
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { id, role } = decoded;

    if (role === "Driver") {
      drivers[id] = socket.id;
    } else {
      users[id] = socket.id;
    }

    console.log("Users:", users);
    console.log("Drivers:", drivers);

    socket.emit("registered", { id, role });
  } catch (error) {
    console.log("Invalid token:", error.message);
    io.to(socket.id).emit("invalidToken");
    socket.disconnect();
  }

  socket.on("createRide", (rideData) => {
    const { userID, pickup, destination, fare } = rideData;

    activeRides[userID] = {
      userID,
      pickup,
      destination,
      status: "waiting",
      fare,
    };

    console.log("activeRides", activeRides);
    Object.values(drivers).forEach((driverSocketId) => {
      io.to(driverSocketId).emit("newRideRequest", activeRides[userID]);
    });

    console.log("Ride request sent to drivers:", activeRides[userID]);
  });

  socket.on("availableDriver", (rideData) => {
    const { userID, pickup, destination, fare, driverID } = rideData;
    if (activeRides[userID].status !== "waiting") return;
    console.log("driver ava", rideData);
    io.to(users[userID]).emit("counterOffer", rideData);

    console.log("Counter Offer", activeRides[userID]);
  });

  socket.on("acceptRide", async (rideData) => {
    const { userID, driverID, departure, arrival, fare } = rideData;
    if (!activeRides[userID]) return;
    try {
      activeRides[userID].status = "accepted";
      activeRides[userID].driverID = driverID;

      Object.values(drivers).forEach((driverSocketId) => {
        if (driverSocketId !== drivers[driverID])
          io.to(driverSocketId).emit("rideTaken", activeRides[userID]);
      });

      const rideID = await createRide(
        userID,
        driverID,
        departure,
        arrival,
        fare
      );
      activeRides[userID].rideID = rideID;
      rideData.rideID = rideID
      io.to(users[userID]).emit("rideAccepted", rideData);
      io.to(drivers[driverID]).emit("rideAccepted", rideData);
    } catch (err) {}
  });

  socket.on("cancelRide", async ({ userID, driverID, rideID }) => {
    if (activeRides[userID]) {
      try {
        delete activeRides[userID];
        io.to(users[userID]).emit("rideCancelled");
        io.to(drivers[driverID]).emit("rideCancelled");
        await cancelRide(rideID);
      } catch (err) {}
    }
  });

  socket.on("completeRide", async ({ userID, driverID }) => {
    try {
      if (activeRides[userID]) {
        const rideid = activeRides[userID].rideID;
        const status = "completed";
        delete activeRides[userID];

        io.to(users[userID]).emit("rideCompleted", status);
        io.to(drivers[driverID]).emit("rideCompleted", status);
        await completeRide(rideid);
      }
    } catch (err) {}
  });

  socket.on("getRideData", async (userID, rideId) => {
    try {
      if (activeRides[userID]) {
        const data = await getRideData(rideId);
        io.to(users[userID]).emit("rideData", data);
      }
    } catch (err) {}
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach((userID) => {
      if (users[userID] === socket.id) delete users[userID];
    });
    Object.keys(drivers).forEach((driverID) => {
      if (drivers[driverID] === socket.id) delete drivers[driverID];
    });
    console.log("User disconnected:", socket.id);
  });
});

//io.on(",", (socket)=>{})
/*
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", (id, role) => {
    if (role === "driver") {
      drivers[id] = socket.id;
    } else {
      users[id] = socket.id;
    }
    console.log("Users:", users);
    console.log("Drivers:", drivers);
  });


  socket.on("createRide", (rideData) => {
    const { userID, pickup, destination } = rideData;
    activeRides[userID] = { userID, pickup, destination, status: "waiting" };


    Object.values(drivers).forEach((driverSocketId) => {
      io.to(driverSocketId).emit("newRideRequest", activeRides[userID]);
    });

    console.log("Ride request sent to drivers:", activeRides[userID]);
  });



  socket.on("acceptRide", async ({ userID, driverID, departure, arrival, km }) => {
    if (!activeRides[userID]) return;
    try {
      activeRides[userID].status = "accepted";
      activeRides[userID].driverID = driverID;


      io.to(users[userID]).emit("rideAccepted", activeRides[userID]);
      io.to(drivers[driverID]).emit("rideAccepted", activeRides[userID]);
      await createRide(userID, driverID, departure, arrival, km)
    } catch (err) {

    }
  });


  socket.on("cancelRide", async ({ userID, driverID, rideID }) => {
    if (activeRides[userID]) {
      try {
        delete activeRides[userID];
        io.to(users[userID]).emit("rideCancelled");
        io.to(drivers[driverID]).emit("rideCancelled");
        await cancelRide(rideID)
      } catch (err) {

      }
    }
  });


  socket.on("completeRide", async ({ userID, driverID, rideID }) => {
    try {
      if (activeRides[userID]) {
        const status = "completed"
        delete activeRides[userID];

        io.to(users[userID]).emit("rideCompleted", status);
        io.to(drivers[driverID]).emit("rideCompleted", status);
        await completeRide(rideID)
      }
    } catch (err) {

    }
  });


  socket.on("getRideData", async (userID, rideId) => {
    try {
      if (activeRides[userID]) {
        const data = await getRideData(rideId)
        io.to(users[userID]).emit("rideData", data);
      }
    } catch (err) {

    }
  });


  socket.on("disconnect", () => {
    Object.keys(users).forEach((userID) => {
      if (users[userID] === socket.id) delete users[userID];
    });
    Object.keys(drivers).forEach((driverID) => {
      if (drivers[driverID] === socket.id) delete drivers[driverID];
    });
    console.log("User disconnected:", socket.id);
  });
});


*/
