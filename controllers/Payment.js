import midtransClient from "midtrans-client";

export const Payment = async (req, res) => {
  try {
    console.log("Incoming Request:", req.body); // Debug input
    const snap = new midtransClient.Snap({
      isProduction: false,
      // serverKey: process.env.MIDTRANS_SERVER_KEY,
      serverKey: "SB-Mid-server-xXoMAtBLKGUd-KdHrz2C8emj",
    });

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.total,
      },
      item_details: [
        {
          id: "ITEM1",
          price: req.body.total,
          quantity: req.body.qty,
          name: req.body.item,
        },
      ],
      customer_details: {
        first_name: req.body.nama,
        phone: req.body.no_telp,
      },
    };

    // snap.createTransaction(parameter).then((transaction) => {
    //   const dataPayment = {
    //     response: JSON.stringify(transaction),
    //   };
    //   const token = transaction.token;

    //   res.status(200).json({ message: "berhasil", dataPayment, token: token });
    // });
    const transaction = await snap.createTransaction(parameter);
    console.log("Transaction Response:", transaction); // Debug response

    res.status(200).json({
      success: true,
      message: "Transaction created successfully",
      token: transaction.token,
    });
  } catch (error) {
    console.error("Error in Payment:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment processing failed",
      error: error.response?.data || error.message,
    });
  }
};
