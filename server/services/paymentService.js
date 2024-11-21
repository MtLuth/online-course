import PayOs from "@payos/node";
import Income, { IncomeStatus } from "../model/incomeModel.js";
import cartRepo from "../repository/cartRepo.js";
import courseRepo from "../repository/courseRepo.js";
import incomeRepo from "../repository/incomeRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
import purchaseHistoryRepo, {
  PurchaseStatus,
} from "../repository/purchaseHistoryRepo.js";
import walletRepo from "../repository/walletRepo.js";
import AppError from "../utils/appError.js";
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
        const stringOrderCode = String(orderCode).padStart(6, "0");

        await purchaseHistoryRepo.updateStatusPurchase(
          stringOrderCode,
          PurchaseStatus.succeed
        );

        const purchase =
          await purchaseHistoryRepo.getPurchaseByCode(stringOrderCode);
        if (!purchase) throw new AppError(`Không tìm thấy hóa đơn`, 400);

        const { uid, sku } = purchase;
        const newIncomes = [];

        await Promise.all(
          sku.map(async (course) => {
            try {
              await courseRepo.updateEnrollment(course.courseId, 1);

              const amount = Math.round(course.salePrice * 0.94);
              const income = new Income(
                amount,
                course,
                IncomeStatus.InProgress,
                stringOrderCode,
                new Date()
              );

              const newId = await this.addIncome(uid, income);
              newIncomes.push(newId);
            } catch (err) {
              console.error(
                `Lỗi khi thêm khóa học ${course.courseId}:`,
                err.message
              );
              throw err;
            }
          })
        );

        console.log(`Thu nhập mới: ${newIncomes.length} mục được thêm`);

        // Cập nhật trạng thái thu nhập sau 30 giây
        setTimeout(async () => {
          try {
            await this.updateStatusIncome(newIncomes);
          } catch (err) {
            console.error(
              `Lỗi khi cập nhật trạng thái thu nhập: ${err.message}`
            );
          }
        }, 1000 * 30);

        // Xóa các khóa học khỏi giỏ hàng và thêm vào danh sách học
        await cartRepo.removeCourses(uid, sku);
        const message = await myLearningsRepo.addCourses(uid, sku);
        return message;
      }
    } catch (error) {
      throw new AppError(`Lỗi khi thêm khóa học: ${error.message}`, 500);
    }
  }

  async addIncome(uid, income) {
    try {
      const newId = await incomeRepo.addIncome(uid, income);
      console.log(`Thêm thu nhập: ${income.amount} vào người dùng: ${uid}`);

      // Cập nhật ví
      await walletRepo.updateWallet(uid, {
        inProgress: income.amount,
      });

      return newId;
    } catch (error) {
      console.error(`Lỗi khi thêm thu nhập cho uid ${uid}: ${error.message}`);
      throw new AppError(error.message, 500);
    }
  }

  async updateStatusIncome(incomes) {
    try {
      await Promise.all(
        incomes.map(async (id) => {
          const income = await incomeRepo.getIncomeById(id);

          if (!income) {
            console.error(`Không tìm thấy thu nhập với ID: ${id}`);
            return;
          }

          const { amount, uid, refundStatus } = income;
          console.log(
            `Thu nhập ${id}: Số tiền ${amount}, UID: ${uid}, refundStatus: ${refundStatus}`
          );

          if (!refundStatus) {
            await Promise.all([
              incomeRepo.updateStatusIncome(id, IncomeStatus.Complete),
              walletRepo.updateWallet(uid, {
                withdrawable: amount,
                inProgress: -amount,
              }),
            ]);
            console.log(`Cập nhật trạng thái thu nhập ID: ${id} hoàn tất`);
          }
        })
      );
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái thu nhập: ${error.message}`);
      throw new AppError(error.message, 500);
    }
  }
}

export default new PaymentService();
