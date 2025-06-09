const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleAirtimeWebhook = async (req, res) => {
  try {
    const { phoneNumber, keyword } = req.body;

    console.log(" Webhook received from telco:", req.body);

    // Find the matching airtime bill
    const airtimeBill = await prisma.airtimeBill.findFirst({
      where: {
        phoneNumber,
        keyword,
        status: 'pending',
      },
    });

    if (!airtimeBill) {
      console.warn(" No matching pending AirtimeBill found for phone number and keyword.");
      return res.status(404).json({ message: "Bill not found or already processed" });
    }

    // Update status to successful
    const updatedBill = await prisma.airtimeBill.update({
      where: { id: airtimeBill.id },
      data: { status: 'successful' },
    });

    console.log(" AirtimeBill updated:", updatedBill);

    return res.status(200).json({ message: "Bill status updated", data: updatedBill });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleAirtimeWebhook };
