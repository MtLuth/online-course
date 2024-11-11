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
    formState: { isSubmitting },
  } = methods;
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);

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
        setTimeout(() => {
          router.push("/resetpassword");
        }, 2000);
      } else {
        console.error("Failed to send reset code");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessageOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          mx: 2,
          boxShadow: 3,
          borderRadius: 3,
          padding: 4,
        }}
      >
        <Stack direction="row" spacing={2}>
          {/* Form Section */}
          <CardContent sx={{ flex: 1 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Email</Typography>
              <TextField
                placeholder="Enter your email"
                fullWidth
                {...methods.register("email")}
              />
              <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                variant="contained"
                loading={isSubmitting}
                onClick={handleSubmit(handleSendCode)}
              >
                Send Password Reset Link
              </LoadingButton>
            </Stack>
          </CardContent>

          {/* Instruction Section */}
          <CardContent
            sx={{
              flex: 1,
              backgroundColor: "#f3f1fe",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Stack spacing={1} alignItems="center">
              <Typography
                variant="h5"
                fontWeight="medium"
                color="text.secondary"
              >
                Forget your password?
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                Reset Password!
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", textAlign: "center", mt: 1 }}
              >
                Enter your email address to receive a password reset link.
              </Typography>
            </Stack>
          </CardContent>
        </Stack>
      </Card>
      <Snackbar
        open={successMessageOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Password reset link sent successfully! Please check your email.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordView;
