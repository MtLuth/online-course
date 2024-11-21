"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";
import { paymentApi } from "@/server/Payment";

const CancelPayment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sessionToken } = useAppContext();
  const { notifyError } = useToastNotification();

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    console.log(orderCode);
    if (orderCode && sessionToken) {
      const cancelPayment = async () => {
        try {
          const response = await paymentApi.paymentCancel(
            orderCode,
            sessionToken
          );
          console.log(response);
          if (response.status === "Successfully") {
            router.push("/cart");
          } else {
            notifyError("Thanh toán không thành công");
          }
        } catch (error) {
          notifyError("Đã xảy ra lỗi khi hủy thanh toán: " + error);
        }
      };

      cancelPayment();
    }
  }, [searchParams, sessionToken, router, notifyError]);

  return (
    <div>
      <h1>Hủy Thanh Toán</h1>
      <p>Đang xử lý hủy giao dịch...</p>
    </div>
  );
};

export default CancelPayment;
