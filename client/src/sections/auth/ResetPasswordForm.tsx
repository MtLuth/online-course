"use client"
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Box, Card, CardContent, Stack, Typography, TextField, Snackbar, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/navigation';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessageOpen, setSuccessMessageOpen] = useState(false); // State to control snackbar visibility

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .required('Please enter your new password')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Please confirm your new password'),
    });

    const methods = useForm<ResetPasswordFormData>({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: { password: '', confirmPassword: '' },
    });

    const { handleSubmit, register } = methods;

    const handleResetPassword = async (data: ResetPasswordFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/auth/reset-password/734f860f550e5396aa7c9360c48b61022ea616896218372da9d4932d597cf27b`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: data.password,
                }),
            });

            if (response.ok) {
                console.log('Password reset successful');
                setSuccessMessageOpen(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                console.error('Failed to reset password');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessMessageOpen(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f4f6f8',
            }}
        >
            <Card sx={{ maxWidth: 600, width: '100%', mx: 2, boxShadow: 3, borderRadius: 3, padding: 4 }}>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h5" textAlign="center">Reset Your Password</Typography>

                        <TextField
                            label="New Password"
                            placeholder="Enter your new password"
                            type="password"
                            fullWidth
                            {...register('password')}
                        />
                        <TextField
                            label="Confirm New Password"
                            placeholder="Confirm your new password"
                            type="password"
                            fullWidth
                            {...register('confirmPassword')}
                        />
                        <LoadingButton
                            fullWidth
                            color="inherit"
                            size="large"
                            variant="contained"
                            loading={isSubmitting}
                            onClick={handleSubmit(handleResetPassword)}
                        >
                            Reset Password
                        </LoadingButton>
                    </Stack>
                </CardContent>
            </Card>
            <Snackbar
                open={successMessageOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Password reset successful! Redirecting to login...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ResetPasswordForm;
