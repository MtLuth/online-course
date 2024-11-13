import { toast } from "react-hot-toast";

export const useToastNotification = () => {
  const notifySuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      duration: 4000,
    });
  };

  const notifyError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      duration: 4000,
    });
  };

  const notifyInfo = (message: string) => {
    toast(message, {
      position: "top-right",
      duration: 4000,
    });
  };

  return { notifySuccess, notifyError, notifyInfo };
};
