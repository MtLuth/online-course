import paymentService from "../services/paymentService.js";
import catchAsync from "../utils/catchAsync.js";
import { createPaymentLinkSchema } from "../validator/validationSchema.js";

class PaymentController {
  createPaymentLink = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const items = await createPaymentLinkSchema.validate(req.body.items, {
      abortEarly: true,
    });
    let total = 0;
    for (let i of items) {
      total = total + i.price * i.quantity;
    }

    const paymentLink = await paymentService.createPayment(
      items,
      total,
      "https://google.com",
      "http://localhost:8080/api/v1/course"
    );
    res.status(200).json({
      status: "Successfully",
      message: paymentLink,
    });
  });
}

export default new PaymentController();
