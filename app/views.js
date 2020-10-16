const express = require("express");
const { homeRouter } = require("./views/home");
const { resumeRouter } = require("./views/resume");

const router = express.Router();

router.use("/", homeRouter);
router.use("/resume", resumeRouter);

module.exports = router;
