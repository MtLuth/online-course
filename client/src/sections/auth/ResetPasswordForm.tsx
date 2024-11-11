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

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

interface ResetPasswordFormProps {
    token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .required("Vui lòng nhập mật khẩu mới")
            .min(8, "Mật khẩu quá ngắn! Phải từ 8 kí tự")
            .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 kí tự in hoa")
            .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 kí tự in thường")
            .matches(/[0-9]/, "Mật khẩu phải là kí tự số")
            .matches(/[@$!%*?&#]/, "Mật khẩu phải có ít nhất 1 kí tự đặc biệt"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
            .required("Vui lòng xác nhận mật khẩu mới"),
    });

    const { handleSubmit, register, formState: { errors } } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: data.password,
                }),
            });

            if (response.ok) {
                setSuccessMessageOpen(true);
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error ${response.status}: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
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
            }}
        >
            <Card sx={{ maxWidth: 600, width: "100%", mx: 2, boxShadow: 3, borderRadius: 3, padding: 4 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h5" textAlign="center">
                            Đặt lại mật khẩu
                        </Typography>

                        <TextField
                            label="Nhập mật khẩu mới"
                            placeholder="Nhập mật khẩu mới của bạn"
                            type="password"
                            fullWidth
                            {...register("password")}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        <TextField
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu mới của bạn"
                            type="password"
                            fullWidth
                            {...register("confirmPassword")}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword?.message}
                        />
                        <LoadingButton
                            fullWidth
                            color="inherit"
                            size="large"
                            variant="contained"
                            loading={isSubmitting}
                            onClick={handleSubmit(handleResetPassword)}
                        >
                            Đặt lại mật khẩu
                        </LoadingButton>
                    </Stack>
                </CardContent>
            </Card>
            {/* Snackbar cho thành công */}
            <Snackbar
                open={successMessageOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    Password reset successful! Redirecting to login...
                </Alert>
            </Snackbar>
            {/* Snackbar cho lỗi */}
            <Snackbar
                open={!!errorMessage}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ResetPasswordForm;
