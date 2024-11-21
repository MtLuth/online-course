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
          let strOrderCode = String(orderCode);
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
          throw new AppError(`Lỗi khi loại bỏ đơn hàng không thanh toán`, 500);
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
        let newIncomes = [];
        await Promise.all(
          sku.map(async (course) => {
            courseRepo.updateEnrollment(course.courseId, 1).catch((err) => {
              throw new AppError(`Error in courseId ${course.courseId}:`, err);
            });

            let amount = course.salePrice * 0.94;
            amount = Math.round(amount);

            const income = new Income(
              amount,
              course,
              IncomeStatus.InProgress,
              orderCode,
              new Date()
            );
            const newId = await this.addIncome(uid, income);
            newIncomes.push(newId);
          })
        );
        console.log(newIncomes.length);
        setTimeout(async () => {
          await this.updateStatusIncome(newIncomes);
        }, 1000 * 30);
        await cartRepo.removeCourses(uid, sku);
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
      console.log("ADD", income.amount);
      await walletRepo.updateWallet(uid, {
        inProgress: income.amount,
      });
      return newId;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async updateStatusIncome(incomes) {
    try {
      await Promise.all(
        incomes.map(async (id) => {
          const income = await incomeRepo.getIncomeById(id);
          const { amount, uid, refundStatus } = income;

          console.log(amount);

          if (!refundStatus) {
            await Promise.all([
              incomeRepo.updateStatusIncome(id, IncomeStatus.Complete),
              walletRepo.updateWallet(uid, {
                withdrawable: amount,
                inProgress: -amount,
              }),
            ]);
          }
        })
      );
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }
}

export default new PaymentService();
