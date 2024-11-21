import PayOs from "@payos/node";
import AppError from "../utils/appError.js";
import purchaseHistoryRepo, {
  PurchaseStatus,
} from "../repository/purchaseHistoryRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
import courseRepo from "../repository/courseRepo.js";
import incomeRepo from "../repository/incomeRepo.js";
import Income, { IncomeStatus } from "../model/incomeModel.js";
import walletRepo from "../repository/walletRepo.js";
import cartRepo from "../repository/cartRepo.js";
class PaymentService {
  constructor() {
    const clientId = "e6eed2dd-86ea-4758-b0ab-f49b28057aae";
    const apiKey = "188c9c69-5a90-4c1c-a0f6-78b710b29fdd";
    const checksumKey =
      "e5a95f3b4f48d9812a9ada502aab43d0a6cfa93f4405a7be39335f75003c878d";
    this.payOs = new PayOs(clientId, apiKey, checksumKey);
  }
  async createPayment(orderCode, courses, total, returnUrl, cancelUrl) {
    console.log(returnUrl);
    const body = {
      orderCode: orderCode,
      amount: total,
      description: "Thanh toán Elearning",
      items: courses,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    };
    setTimeout(
      async () => {
        try {
          const strOrderCode = String(orderCode);
          while (strOrderCode.length < 6) {
            strOrderCode = "0" + strOrderCode;
          }
          const purchaseHistory =
            await purchaseHistoryRepo.getPurchaseByCode(strOrderCode);
          if (purchaseHistory.status === PurchaseStatus.pending) {
            await purchaseHistoryRepo.deletePurchase(strOrderCode);
          }
          return;
        } catch (error) {
          console.log(error);
          throw new AppError(`Lỗi khi loại bỏ đơn hàng không thanh toán`);
        }
      },
      1000 * 60 * 3
    );
    try {
      const paymentLinkResponse = await this.payOs.createPaymentLink(body);
      return paymentLinkResponse;
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  async getPaymentLinkInfor(id) {
    try {
      const paymentLink = await this.payOs.getPaymentLinkInformation(id);
      return paymentLink;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async successPayment(statusCode, orderCode) {
    try {
      if (statusCode === "00") {
        let stringOrderCode = String(orderCode);
        while (stringOrderCode.length < 6) {
          stringOrderCode = "0" + stringOrderCode;
        }
        await purchaseHistoryRepo.updateStatusPurchase(
          stringOrderCode,
          PurchaseStatus.succeed
        );
        const purchase =
          await purchaseHistoryRepo.getPurchaseByCode(stringOrderCode);
        if (purchase === null) {
          throw new AppError(`Không tìm thấy hóa đơn`, 400);
        }
        const uid = purchase.uid;
        const sku = purchase.sku;
        await Promise.allSettled(
          sku.map(async (course) => {
            courseRepo.increaseEnrollment(course.courseId).catch((err) => {
              throw new AppError(`Error in courseId ${course.courseId}:`, err);
            });
            console.log("delete", course.courseId);
            await cartRepo.removeCourse(uid, course.courseId);

            let amount = course.salePrice * 0.94;
            amount = Math.round(amount);

            const income = new Income(
              amount,
              course,
              IncomeStatus.InProgress,
              orderCode,
              new Date()
            );
            this.addIncome(course.instructor, income).catch((err) => {
              throw new AppError(`Error in courseId ${course.courseId}:`, err);
            });
          })
        );
        const message = await myLearningsRepo.addCourses(uid, sku);
        return message;
      }
    } catch (error) {
      throw new AppError(`Lỗi khi thêm khóa học: ${error}`);
    }
  }

  async addIncome(uid, income) {
    try {
      const newId = await incomeRepo.addIncome(uid, income);
      await walletRepo.updateWallet(uid, {
        inProgress: income.amount,
      });

      setTimeout(
        async () => {
          try {
            await this.updateStatusIncome(newId);
          } catch (error) {
            console.error("Error updating wallet or income status:", error);
          }
        },
        1000 * 60 * 3
      );
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async updateStatusIncome(id) {
    try {
      const income = await incomeRepo.getIncomeById(id);
      const amount = income.amount;
      const uid = income.uid;
      if (income.refundStatus === false) {
        await Promise.all([
          incomeRepo.updateStatusIncome(id, IncomeStatus.Complete),
          walletRepo.updateWallet(uid, {
            withdrawable: amount,
            inProgress: -amount,
          }),
        ]);
      }
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new PaymentService();
