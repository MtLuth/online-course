"use client";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";

const ForgotPasswordView = () => {
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Please enter your email")
      .email("Invalid email address"),
  });

  const router = useRouter();
  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendCode = async () => {
    const email = methods.getValues("email");
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/send-email/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Reset code sent successfully:", data.resetToken);
        setSuccessMessageOpen(true);

        const resetLink = `/resetpassword/${data.resetToken}`;
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error ${response.status}: ${errorData.message}`);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Error sending reset code:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessageOpen(false);
    setErrorMessage(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        padding: 1,
      }}
    >
      <Card
        sx={{
          maxWidth: 900,
          width: "100%",
          mx: 2,
          boxShadow: 10,
          borderRadius: 4,
          padding: 3,
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Form Section */}
          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Email</Typography>
              <TextField
                placeholder="Nhập Email của bạn"
                fullWidth
                {...methods.register("email")}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit(handleSendCode)}
              >
                Đặt lại mật khẩu
              </LoadingButton>
            </Stack>
          </CardContent>

          {/* Instruction Section */}
          <CardContent
            sx={{
              flex: 1,
              backgroundColor: "#f3f1fe",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Typography
                variant="h5"
                fontWeight="medium"
                color="text.secondary"
              >
                Quên mật khẩu?
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                Đặt lại mật khẩu!
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", textAlign: "center", mt: 1 }}
              >
                Nhập địa chỉ email của bạn để nhận liên kết khôi phục mật khẩu.
              </Typography>
            </Stack>
          </CardContent>
        </Stack>
      </Card>
      <Snackbar
        open={successMessageOpen || Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {successMessageOpen ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Liên kết đặt lại mật khẩu đã gửi thành công! Vui lòng kiểm tra email của bạn.
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordView;
