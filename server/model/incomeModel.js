const IncomeStatus = {
  InProgress: "Đang xử lý",
  Complete: "Đã xử lý xong",
};
class Income {
  constructor(amount, course, status, orderCode, date) {
    this.amount = amount;
    this.course = course;
    this.status = status;
    this.orderCode = orderCode;
    this.date = date;
  }
}

export default Income;
export { IncomeStatus };
