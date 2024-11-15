import paymentService from "../services/paymentService.js";
import catchAsync from "../utils/catchAsync.js";
import { createPaymentLinkSchema } from "../validator/validationSchema.js";

class PaymentController {
  createPaymentLink = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const orderCode = req.orderCode;
    const items = await createPaymentLinkSchema.validate(req.body.items, {
      abortEarly: true,
    });
    let total = 0;
    for (let i of items) {
      total = total + i.price * i.quantity;
    }

    const paymentLink = await paymentService.createPayment(
      orderCode,
      items,
      total,
      "https://97d8-2405-4800-5f2d-3300-c48a-3b1b-7f5f-203e.ngrok-free.app/api/v1/payment/call-back",
      "http://localhost:8080/api/v1/course"
    );
    res.status(200).json({
      status: "Successfully",
      message: paymentLink,
    });
  });

  callbackUrl = catchAsync(async (req, res, next) => {
    const paymentLink = await paymentService.getPaymentLinkInfor(
      "719bebebd6644c7085f2889d3cc020fe"
    );
    res.status(200).json({ paymentLink });
  });
}
export default new PaymentController();
