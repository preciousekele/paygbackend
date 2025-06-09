const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get Total Balance
const getTotalBalance = async (req, res) => {
  try {
    const { email, phoneNumber } = req.query;

    if (!email || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Email and phoneNumber are required" });
    }

    // Try to find by composite key first
    let record = await prisma.totalBalance.findUnique({
      where: {
        email_phoneNumber: {
          email,
          phoneNumber,
        },
      },
    });

    // If not found with composite key, try with just phoneNumber
    if (!record) {
      record = await prisma.totalBalance.findFirst({
        where: {
          phoneNumber,
          email,
        },
      });
    }

    if (!record) {
      // Return 0 balance instead of 404 for better UX
      console.log(`No balance record found for ${email} / ${phoneNumber}, returning 0.00`);
      return res.status(200).json({ totalAmount: 0 });
    }

    console.log(
      `Total balance for ${email} / ${phoneNumber}: ₦${record.totalAmount}`
    );

    return res.status(200).json({ totalAmount: record.totalAmount });
  } catch (error) {
    console.error("Error in getTotalBalance:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTotalBalance,
};