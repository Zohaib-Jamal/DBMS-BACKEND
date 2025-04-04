const { sql } = require("./config.js");

const createVehicle = async (data) => {
  try {
    const { driverID, vehicleType, plateNo, model } = data;
    const snap = await sql.query(
      `INSERT INTO Vehicle (DriverID, VehicleType, PlateNo, Model ) 
        VALUES 
        ('${driverID}','${vehicleType}','${plateNo}', '${model}')`
    );
    console.log(snap);
  } catch (Err) {
    if (Err.number === 2627) {
      throw new Error("Vehicle already exists.");
    }
    throw new Error("Error: Could not Register Vehicle");
  }
};

const getVehicle = async (data) => {
  try {
    const { vehicleID } = data;

    const snap = await sql.query(
      `SELECT * FROM Vehicle WHERE ${vehicleID} = VehicleID`
    );
    if (!snap.recordset[0])
      throw new Error("No record found!");
    return snap.recordset;
  } catch (Err) {
    throw new Error("Error: Could not Find Vehicle");
  }
};

const deleteVehicle = async (data) => {
  try {
    const { vehicleID } = data;

    const snap = await sql.query(
      `DELETE FROM Vehicle WHERE ${vehicleID} = VehicleID )`
    );
  } catch (Err) {
    throw new Error("Error: Could not Register Driver");
  }
};

module.exports = {
  createVehicle,
  getVehicle,
  deleteVehicle,
};
