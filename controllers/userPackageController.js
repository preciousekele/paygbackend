const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET current package by email
const getUserPackage = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { package: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ currentPackage: user.package });
  } catch (error) {
    console.error("Error fetching user package:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT upgrade user package
const upgradeUserPackage = async (req, res) => {
  const { email, newPackage } = req.body;

  if (!email || !newPackage) {
    return res.status(400).json({
      message: "Email and newPackage are required",
    });
  }

  if (!["STANDARD", "PREMIUM"].includes(newPackage)) {
    return res.status(400).json({ message: "Invalid package type" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.package === newPackage) {
      return res.status(400).json({
        message: `User is already on the ${newPackage} plan`,
      });
    }

    // Update user package
    await prisma.user.update({
      where: { email },
      data: { package: newPackage },
    });

    // Determine new package balance amount
    let totalPackageAmount = 25000;
    if (newPackage === "STANDARD") totalPackageAmount = 50000;
    if (newPackage === "PREMIUM") totalPackageAmount = 100000;

    // Update or create package balance
    const existingBalance = await prisma.packageBalance.findUnique({
      where: { userId: user.id },
    });

    if (existingBalance) {
      // Reset balance to new package value
      await prisma.packageBalance.update({
        where: { userId: user.id },
        data: {
          packageType: newPackage,
          totalPackage: totalPackageAmount,
          balanceTbPaid: totalPackageAmount,
        },
      });
    } else {
      await prisma.packageBalance.create({
        data: {
          userId: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          packageType: newPackage,
          totalPackage: totalPackageAmount,
          balanceTbPaid: totalPackageAmount,
        },
      });
    }

    // Log the upgrade
    await prisma.userPackageHistory.create({
      data: {
        userId: user.id,
        oldPackage: user.package,
        newPackage,
      },
    });

    return res
      .status(200)
      .json({ message: `Package upgraded to ${newPackage}` });
  } catch (error) {
    console.error("Error upgrading package:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET package balance - Updated to auto-create if missing
const getPackageBalance = async (req, res) => {
  const { email } = req.query;
  if (!email)
    return res.status(400).json({ message: "Email is required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    let balance = await prisma.packageBalance.findUnique({
      where: { userId: user.id },
    });

    // If no package balance exists, create one based on user's current package
    if (!balance) {
      const userPackage = user.package || "BASIC";
      let totalPackageAmount = 25000;
      if (userPackage === "STANDARD") totalPackageAmount = 50000;
      if (userPackage === "PREMIUM") totalPackageAmount = 100000;

      balance = await prisma.packageBalance.create({
        data: {
          userId: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          packageType: userPackage,
          totalPackage: totalPackageAmount,
          balanceTbPaid: totalPackageAmount,
        },
      });
    }

    return res.status(200).json({ data: balance });
  } catch (error) {
    console.error("Error fetching package balance:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUserPackage,
  upgradeUserPackage,
  getPackageBalance,
};