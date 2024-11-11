'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Iconify from 'src/components/iconify';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useBoolean } from "@/hook/useBoolean";
import RouterLink from "@/routes/components/RouterLink";
import { paths } from "@/routes/path";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import Divider from "@mui/material/Divider";
import { useRouter } from "@/routes/hooks/useRouter";
import { useState } from 'react';

export default function LoginView() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const passwordShow = useBoolean();
  const router = useRouter();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Vui lòng nhập email').email('Địa chỉ email không hợp lệ'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        const { status, message } = result;

        if (status === "success") {
          const token = message?.tokenPairs?.accessToken;

          if (token) {
            localStorage.setItem('jwt', token);
          } else {
            console.log('Token không tồn tại trong phản hồi');
          }

          reset();
          setSuccessMessage("Đăng nhập thành công!");
          setOpenSnackbar(true);
        } else {
          setErrorMessage(`Đăng nhập thất bại: ${message}`);
          setOpenSnackbar(true);
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(`Error ${response.status}: ${errorData.message}`);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setOpenSnackbar(true);
    }
  });

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const renderHead = (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h3" paragraph>
        Đăng nhập
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`Chưa có tài khoản? `}
        <Link component={RouterLink} href={paths.register} variant="subtitle2" color="primary">
          Đăng ký ngay
        </Link>
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5} alignItems="flex-end">
        <RHFTextField
          name="email"
          label="Địa chỉ email"
          variant="outlined"
        />
        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={passwordShow.value ? 'text' : 'password'}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify icon={passwordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link component={RouterLink} href={paths.forgotpassword} variant="body2" underline="always" color="text.secondary">
          Quên mật khẩu?
        </Link>
        <LoadingButton fullWidth color="inherit" size="large" type="submit" variant="contained" loading={isSubmitting}>
          Đăng nhập
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 16, boxShadow: 3 }}>
      <CardContent>
        {renderHead}
        <Divider sx={{ my: 2 }} />
        {renderForm}
      </CardContent>

      {/* Popup thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
