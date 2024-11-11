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
import Divider from '@mui/material/Divider';

import Iconify from 'src/components/iconify';
import { useBoolean } from "@/hook/useBoolean";
import RouterLink from "@/routes/components/RouterLink";
import { paths } from "@/routes/path";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { useRouter } from "@/routes/hooks/useRouter";
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function RegisterView() {
  const passwordShow = useBoolean();
  const confirmPasswordShow = useBoolean();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('Vui lòng nhập họ và tên')
      .min(6, 'Tối thiểu 6 ký tự')
      .max(20, 'Tối đa 20 ký tự'),
    email: Yup.string().required('Vui lòng nhập email').email('Email không hợp lệ'),
    phoneNumber: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(/^\+84\d{9,10}$/, 'Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại với mã vùng +84')
      .test('phone-length', 'Số điện thoại không hợp lệ', (value) => {
        const phoneNumberWithoutPlus = value?.replace('+', '');
        return phoneNumberWithoutPlus.length >= 10 && phoneNumberWithoutPlus.length <= 11;
      }),
    password: Yup.string()
      .required('Vui lòng nhập mật khẩu')
      .min(6, 'Mật khẩu cần ít nhất 6 ký tự'),
    confirmPassword: Yup.string()
      .required('Vui lòng xác nhận mật khẩu')
      .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
  });

  const defaultValues = {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log('Data being sent:', data); // Kiểm tra dữ liệu client gửi đi

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Nếu đăng ký thành công
        const result = await response.json();
        console.log('Đăng ký thành công:', result);

        setErrorMessage("Đăng ký thành công!");
        setOpenSnackbar(true);

        reset(); // Xóa form sau khi đăng ký thành công
        // Điều hướng hoặc thực hiện hành động khác nếu cần
      } else {
        // Nếu đăng ký không thành công
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Đăng ký không thành công';

        console.error('Error:', errorMessage);
        setErrorMessage(errorMessage);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
      setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setOpenSnackbar(true);
    }
  });




  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const renderHead = (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h3" paragraph>
        Bắt đầu ngay
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {`Đã có tài khoản? `}
        <Link
          component={RouterLink}
          href={paths.login}
          variant="subtitle2"
          color="primary"
        >
          Đăng nhập
        </Link>
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        <RHFTextField name="fullName" label="Họ và tên" />

        <RHFTextField name="phoneNumber" label="Số Điện Thoại" />

        <RHFTextField name="email" label="Địa chỉ email" />

        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={passwordShow.value ? 'text' : 'password'}
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

        <RHFTextField
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          type={confirmPasswordShow.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPasswordShow.onToggle} edge="end">
                  <Iconify icon={confirmPasswordShow.value ? 'carbon:view' : 'carbon:view-off'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Đăng ký
        </LoadingButton>

      </Stack>
    </FormProvider>
  );

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 16, mb: 4, boxShadow: 3 }}>
      <CardContent>
        {renderHead}
        <Divider sx={{ my: 2 }} />
        {renderForm}
      </CardContent>

      {/* Hiển thị thông báo lỗi */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={errorMessage === "Đăng ký thành công!" ? "success" : "error"} sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
