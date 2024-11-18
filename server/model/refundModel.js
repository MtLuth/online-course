const RefundStatus = {
  InProgress: "Đang xử lý",
  Cancel: "Đã hủy",
  Complete: "Đã hoàn tiền",
  Reject: "Hệ thống từ chối",
};

class Refund {
  constructor(id, orderCode, courseId, amount, status, reason, payeeAccount) {
    this.id = id;
    this.orderCode = orderCode;
    this.courseId = courseId;
    this.amount = amount;
    this.status = status;
    this.reason = reason;
    this.payeeAccount = payeeAccount;
  }
}

export default Refund;
export { RefundStatus };
