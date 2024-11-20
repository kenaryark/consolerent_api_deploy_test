// import express from "express";
// import midtransClient from "midtrans-client";

// const router = express.Router();

// router.post("/process-transaction", (req, res) => {
//   try {
//     const snap = new midtransClient.Snap({
//       isProduction: false,
//       serverKey: "SB-Mid-server-xXoMAtBLKGUd-KdHrz2C8emj",
//       clientKey: "SB-Mid-client-wJ_pLXueR21FUDe9",
//     });

//     const parameter = {
//       transaction_details: {
//         order_id: req.body.order_id,
//         gross_amount: req.body.total,
//       },
//       item_details: [
//         {
//           id: "ITEM1",
//           price: req.body.total,
//           quantity: req.body.qty,
//           name: req.body.item,
//         },
//       ],
//       customer_details: {
//         first_name: req.body.nama,
//         phone: req.body.no_telp,
//       },
//     };

//     snap.createTransaction(parameter).then((transaction) => {
//       const dataPayment = {
//         response: JSON.stringify(transaction),
//       };
//       const token = transaction.token;

//       res.status(200).json({ message: "berhasil", dataPayment, token: token });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;

import express from "express";
import { Payment } from "../controllers/Payment";

const router = express.Router();

router.post("/process-transaction", Payment);

export default router;
