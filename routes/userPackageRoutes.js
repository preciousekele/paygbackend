const express = require("express");
const router = express.Router();
const {
  getUserPackage,
  upgradeUserPackage,
} = require("../controllers/userPackageController");

router.get("/user/package", getUserPackage);
router.put("/user/upgrade-package", upgradeUserPackage);

module.exports = router;
