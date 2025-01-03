import { PurchaseStatus } from "../repository/purchaseHistoryRepo.js";
import paymentService from "../services/paymentService.js";
import purchaseServices from "../services/purchaseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { createPaymentLinkSchema } from "../validator/validationSchema.js";

class PaymentController {
  createPaymentLink = catchAsync(async (req, res, next) => {
    const bill = req.bill;
    const orderCode = Number(bill.code);
    const sku = bill.sku;
    let items = [];
    for (let e of sku) {
      const item = {
        name: e.title,
        quantity: 1,
        price: e.salePrice,
      };
      items.push(item);
    }
    const total = bill.total;

    const paymentLink = await paymentService.createPayment(
      orderCode,
      items,
      total,
      "http://localhost:3000/mylearning/",
      "http://localhost:3000/cancelpayment"
    );
    res.status(200).json({
      status: "Successfully",
      message: {
        items: items,
        paymentLink,
      },
    });
  });

  callbackUrl = catchAsync(async (req, res, next) => {
    const statusCode = req.body.code;
    const data = req.body.data;
    const orderCode = data.orderCode;
    let message = "hello";
    if (orderCode !== 123) {
      message = await paymentService.successPayment(statusCode, orderCode);
    }
    console.log(req.body);
    res.status(200).json({
      status: 200,
      message: req.body,
    });
  });

  cancelPayment = catchAsync(async (req, res, next) => {
    const code = req.query.orderCode;
    const message = await purchaseServices.deletePurchase(code);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}
export default new PaymentController();
