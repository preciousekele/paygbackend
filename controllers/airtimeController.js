const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const purchaseAirtime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { telecom, phoneNumber, amount, keyword, percentage } = req.body;

    // Validate inputs
    if (!telecom || !phoneNumber || !amount || !keyword || percentage == null) {
      return res.status(400).json({
        message: "All fields are required: telecom, phoneNumber, amount, keyword, percentage",
      });
    }

    if (percentage < 10 || percentage > 90) {
      return res.status(400).json({ message: "Percentage must be between 10 and 90" });
    }

    const network = telecom.trim().toUpperCase();
    const number = phoneNumber.trim();

    // Get the user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userPackage = user.package || "BASIC";
    let totalPackageAmount = 25000;
    if (userPackage === "STANDARD") totalPackageAmount = 50000;
    if (userPackage === "PREMIUM") totalPackageAmount = 100000;

    // Calculate deduction from package
    const deductedAmount = Math.floor((percentage / 100) * amount);

    // Handle package balance deduction
    let userPackageBalance = await prisma.packageBalance.findUnique({ where: { userId } });

    if (!userPackageBalance) {
      userPackageBalance = await prisma.packageBalance.create({
        data: {
          userId,
          email: user.email,
          phoneNumber: user.phoneNumber,
          packageType: userPackage,
          totalPackage: totalPackageAmount,
          balanceTbPaid: totalPackageAmount - deductedAmount,
        },
      });
    } else {
      // Check if package payment is completed (balance is 0)
      if (userPackageBalance.balanceTbPaid === 0) {
        return res.status(200).json({
          message: "Package payment completed"
        });
      }

      const newBalance = userPackageBalance.balanceTbPaid - deductedAmount;
      await prisma.packageBalance.update({
        where: { userId },
        data: { balanceTbPaid: Math.max(0, newBalance) },
      });
    }

    // Track total airtime amount per number/email
    const existingTotalBalance = await prisma.totalBalance.findUnique({
      where: {
        email_phoneNumber: {
          email: user.email,
          phoneNumber: number,
        },
      },
    });

    if (existingTotalBalance) {
      await prisma.totalBalance.update({
        where: {
          email_phoneNumber: {
            email: user.email,
            phoneNumber: number,
          },
        },
        data: {
          totalAmount: existingTotalBalance.totalAmount + amount,
        },
      });
    } else {
      await prisma.totalBalance.create({
        data: {
          email: user.email,
          phoneNumber: number,
          totalAmount: amount,
        },
      });
    }

    // Save the bill record with percentage info
    const airtimeBill = await prisma.airtimeBill.create({
      data: {
        userId,
        phoneNumber: number,
        network,
        keyword,
        amountDeducted: amount,
        percentage,
        percentageAmount: deductedAmount,
        status: "pending",
        package: userPackage,
      },
    });

    return res.status(200).json({
      message: "Airtime purchase initiated",
      data: {
        phoneNumber: number,
        amountInitiated: amount,
        percentage,
        percentageAmount: deductedAmount,
        deductedFromPackage: deductedAmount,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error in purchaseAirtime:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAirtimePurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const bills = await prisma.airtimeBill.findMany({
      where: { userId },
      select: {
        phoneNumber: true,
        keyword: true,
        amountDeducted: true,
        percentage: true,
        percentageAmount: true,
        network: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Airtime purchase history fetched successfully",
      data: bills,
    });
  } catch (error) {
    console.error("Error fetching airtime history:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  purchaseAirtime,
  getAirtimePurchaseHistory,
};