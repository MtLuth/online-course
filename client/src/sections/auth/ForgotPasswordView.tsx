'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useBoolean } from '@/hook/useBoolean';
import { paths } from '@/routes/path';

import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
    Link,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import RouterLink from '@/routes/components/RouterLink';

const ForgotPasswordView = () => {
    const emailSent = useBoolean();

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().required('Please enter your email').email('Invalid email address'),
    });

    const defaultValues = {
        email: '',
    };

    const methods = useForm({
        resolver: yupResolver(ForgotPasswordSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            emailSent.onTrue();
            console.log('EMAIL SENT', data);
        } catch (error) {
            console.error(error);
        }
    });

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
            <Card sx={{ maxWidth: 1000, width: '100%', mx: 2, boxShadow: 3, borderRadius: 3, padding: 4 }}>
                <Stack direction="row" spacing={2}>

                    {/* Form Section */}
                    <CardContent sx={{ flex: 2 }}>
                        <Stack spacing={2}>
                            <Typography variant="subtitle1">Email</Typography>
                            <TextField
                                placeholder="Enter your email"
                                fullWidth
                                {...methods.register('email')}
                                InputProps={{
                                    sx: {
                                        height: 50, // Điều chỉnh độ cao của TextField
                                        display: 'flex',
                                        alignItems: 'center', // Căn giữa placeholder theo chiều dọc
                                    },
                                }}
                            />

                            <LoadingButton
                                fullWidth
                                color="inherit"
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                onClick={onSubmit}
                            >
                                Send Password Reset Link
                            </LoadingButton>
                            <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
                                Login to your account from{' '}
                                <Link component={RouterLink} href={paths.login} underline="always">
                                    here
                                </Link>
                            </Typography>
                        </Stack>
                    </CardContent>

                    {/* Instruction Section */}
                    <CardContent
                        sx={{
                            flex: 2,
                            backgroundColor: '#f3f1fe',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 2,
                        }}
                    >
                        <Stack spacing={1} alignItems="center">
                            <Typography variant="h5" fontWeight="medium" color="text.secondary">
                                Forget your password?
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                Reset Password!
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
                                Enter your email address to receive a password reset link.
                            </Typography>
                        </Stack>
                    </CardContent>

                </Stack>
            </Card>
        </Box>
    );
};

export default ForgotPasswordView;
