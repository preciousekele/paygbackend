// routes/webhookRoutes.js

const express = require('express');
const router = express.Router();
const { handleAirtimeWebhook } = require('../controllers/webhookService');

router.post('/airtime', handleAirtimeWebhook);

module.exports = router;
