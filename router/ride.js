const express = require('express')
const router = express.Router()
const { addComment, setUserRating, setDriverRating } = require("../db/ride.js")
const { validateToken } = require("../middleware/auth.js")
router.use(validateToken)


router.post("/comment", async (req, res) => {
    try {
        const data = req.body;

        if (
            !data.rideID ||
            !data.message
        ) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        await addComment(data)
        res
            .status(200).send({ message: "Comment Added", data });

    } catch (err) {
        if (err.message === "Out of Range") {
            return res
                .status(400)
                .send({ message: "Out of Range", data: null });
        }

        res.status(500).send({ message: "Rating Failed!", data: null });
    }
})

router.post("/rating/user", async (req, res) => {
    try {
        const data = req.body;

        if (req.role !== "Driver")
            return res.status(403).send({ message: "Unauthorized!" });

        if (
            !data.rideID ||
            !data.rating
        ) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        await setUserRating(data)
        res
            .status(200).send({ message: "Rating Added", data });

    } catch (err) {
        if (err.message === "Out of Range") {
            return res
                .status(400)
                .send({ message: "Out of Range", data: null });
        }

        res.status(500).send({ message: "Rating Failed!", data: null });
    }
})

router.post("/rating/driver", async (req, res) => {
    try {
        const data = req.body;

        if (req.role !== "User")
            return res.status(403).send({ message: "Unauthorized!" });

        if (
            !data.rideID ||
            !data.rating
        ) {
            return res.status(400).send({ message: "Missing required fields" });
        }

        await setDriverRating(data)
        res
            .status(200).send({ message: "Rating Added", data });

    } catch (err) {
        if (err.message === "Comment already exists.") {
            return res
                .status(400)
                .send({ message: "Comment Already Exists!", data: null });
        }

        res.status(500).send({ message: "Comment Failed!", data: null });
    }
})

module.exports = router