const express = require("express");
const router = express.Router();
const { getTotalBalance } = require("../controllers/totalBalance");

router.get("/total-balance", getTotalBalance);

module.exports = router;
