const express = require('express');
const router = express.Router();
const { purchaseAirtime, getAirtimePurchaseHistory } = require('../controllers/airtimeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/subscribe', authMiddleware, purchaseAirtime);
router.get("/airtime-history", authMiddleware, getAirtimePurchaseHistory);
module.exports = router;
