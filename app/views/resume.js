const express = require("express");
const path = require("path");

const router = express.Router();

const resumePath = path.join(__dirname, "../static/resume.pdf");

router.get("/", (req, res) => {
    res.sendFile(resumePath);
});

module.exports = {
    resumeRouter: router,
};
