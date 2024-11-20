import midtransClient from "midtrans-client";

export const Payment = async (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      //   serverKey: "SB-Mid-server-xXoMAtBLKGUd-KdHrz2C8emj",
      //   clientKey: "SB-Mid-client-wJ_pLXueR21FUDe9",
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
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

    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction),
      };
      const token = transaction.token;

      res.status(200).json({ message: "berhasil", dataPayment, token: token });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
