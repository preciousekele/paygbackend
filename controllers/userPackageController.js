const { PrismaClient, PackageType } = require("@prisma/client");
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
    return res
      .status(400)
      .json({ message: "Email and newPackage are required" });
  }

  // Validate newPackage
  if (!["STANDARD", "PREMIUM"].includes(newPackage)) {
    return res.status(400).json({ message: "Invalid package type" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.package === newPackage) {
      return res
        .status(400)
        .json({ message: `User is already on the ${newPackage} plan` });
    }

    // Update user's package
    await prisma.user.update({
      where: { email },
      data: { package: newPackage },
    });

    // Log upgrade in UserPackage history
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

module.exports = {
  getUserPackage,
  upgradeUserPackage,
};
