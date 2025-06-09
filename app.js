const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const airtimeRoutes = require('./routes/airtimeRoutes');
const webhookRoutes = require('./routes/webhookRoute');
const totalBalanceRoutes = require("./routes/totalBalanceRoutes");
const userPackageRoutes = require("./routes/userPackageRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/airtime', airtimeRoutes);
app.use('/api/webhook', webhookRoutes);
app.use("/api", totalBalanceRoutes);
app.use("/api", userPackageRoutes);

module.exports = app;
