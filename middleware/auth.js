var jwt = require('jsonwebtoken');
require("dotenv").config();
/*

HEADERS{
    authorization: "BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6IlVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.HEo0xyLW_XYOLqszXq-lJUGsXvhTXDO67sVM0W3TX6k"
}
*/
const validateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        if (decoded) {
            next()
        }
        else {
            return res.status(403).json({ message: "Unauthorized" });
        }

    } catch (err) {
        return res.status(500).json({ message: "An Error Occured" });
    }
}

module.exports = { validateToken }