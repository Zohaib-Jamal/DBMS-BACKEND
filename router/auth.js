const { app } = require("../server");
const { createVehicle, loginUser, loginDriver } = require("../db");

app.post("/signup_user", async (req, res) => {
  try {
    const data = req.body;
    await createUser(data);
    console.log(data);
    res.status(200).send({ message: "Signup successful!", receivedData: data });
  } catch (err) {}
});

app.post("/login", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const userData = await loginUser(data);
    console.log(userData);
    res
      .status(200)
      .send({ message: "Login successful!", receivedData: userData });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Login  Failed!", receivedData: null });
  }
});

app.post("/login_driver", async (req, res) => {
  try {
    const data = req.body;
  
    const driverData = await loginDriver(data);

    res
      .status(200)
      .send({ message: "Login successful!", receivedData: driverData });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Login  Failed!", receivedData: null });
  }
});

app.post("/signup_driver", async (req, res) => {
  try {
    const data = req.body;
    const driverData = await createDriver(data);
    res.status(200).send({ message: "Signup Successful!", data: driverData });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Driver SignUp  Failed!", receivedData: null });
  }
});

app.post("/create_vehicle", async (req, res) => {
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
