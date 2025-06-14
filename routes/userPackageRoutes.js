const express = require("express");
const router = express.Router();
const {
  getUserPackage,
  upgradeUserPackage,
  getPackageBalance,
} = require("../controllers/userPackageController");

router.get("/user/package", getUserPackage);
router.put("/user/upgrade-package", upgradeUserPackage);
router.get("/package-balance", getPackageBalance);

module.exports = router;
