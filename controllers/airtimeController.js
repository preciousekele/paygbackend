const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const purchaseAirtime = async (req, res) => {
  try {
    const userId = req.user.id;
    const { telecom, phoneNumber, amount, keyword } = req.body;

    // Validate input
    if (!telecom || !phoneNumber || !amount || !keyword) {
      return res.status(400).json({
        message: "All fields are required: telecom, phoneNumber, amount, keyword",
      });
    }

    const network = telecom.trim().toUpperCase();
    const number = phoneNumber.trim();

    // Find or create airtime line balance
    let networkBalance = await prisma.airtimeNetworkBalance.findUnique({
      where: {
        network_phoneNumber: {
          network,
          phoneNumber: number,
        },
      },
    });

    if (!networkBalance) {
      networkBalance = await prisma.airtimeNetworkBalance.create({
        data: {
          network,
          phoneNumber: number,
          balance: 20000, // Default initial balance
        },
      });
    }

    // Check if the telecom line has enough balance
    if (networkBalance.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient airtime balance on network line" });
    }

    // Deduct airtime from telecom balance
    const updatedBalance = networkBalance.balance - amount;

    await prisma.airtimeNetworkBalance.update({
      where: {
        network_phoneNumber: {
          network,
          phoneNumber: number,
        },
      },
      data: {
        balance: updatedBalance,
      },
    });

    // Create bill record
    const airtimeBill = await prisma.airtimeBill.create({
      data: {
        userId,
        phoneNumber: number,
        network,
        keyword,
        amountDeducted: amount,
        status: "pending",
        package: "",
      },
    });

    // Log airtime balance history (telecom-based)
    await prisma.airtimeBalanceHistory.create({
      data: {
        network,
        phoneNumber: number,
        previousBalance: networkBalance.balance,
        amountChanged: -amount,
        newBalance: updatedBalance,
        status: "pending",
        airtimeBillId: airtimeBill.id,
      },
    });

    // Get user details
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update or create totalBalance - FIXED LOGIC
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

    return res.status(200).json({
      message: "Airtime purchase initiated. Awaiting confirmation.",
      data: {
        phoneNumber: number,
        amountDeducted: amount,
        network,
        status: airtimeBill.status,
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
        network: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
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