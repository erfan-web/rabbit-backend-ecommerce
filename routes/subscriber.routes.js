const express = require("express");
const router = express.Router();
const { subscribe } = require("../controllers/subscriber.controller");

router.post("/", subscribe);

module.exports = router;
