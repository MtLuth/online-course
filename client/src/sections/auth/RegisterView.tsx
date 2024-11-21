"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { useBoolean } from "@/hook/useBoolean";
import { useToastNotification } from "@/hook/useToastNotification";
import RouterLink from "@/routes/components/RouterLink";
import { paths } from "@/routes/path";
import { authApi } from "@/server/Auth";
import { useRouter } from "next/navigation";
import Iconify from "src/components/iconify";

export default function RegisterView() {
  const passwordShow = useBoolean();
  const confirmPasswordShow = useBoolean();

  const router = useRouter();
  const { notifySuccess, notifyError } = useToastNotification();

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Vui lòng nhập họ và tên")
      .min(8, "Tối thiểu 8 ký tự")
      .max(20, "Tối đa 20 ký tự"),
    email: Yup.string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phoneNumber: Yup.string().required("Vui lòng nhập số điện thoại"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu cần ít nhất 8 ký tự"),
    confirmPassword: Yup.string()
      .required("Vui lòng xác nhận mật khẩu")
      .oneOf([Yup.ref("password")], "Mật khẩu không khớp"),
  });

  const defaultValues = {
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    authApi
      .register(data)
      .then((res) => {
        notifySuccess(
          "Đăng ký thành công! Vui lòng kiểm tra Email để xác thực tài khoản!"
        );
        reset();
        router.push("/login");
      })
      .catch((error) => {
        const errorMessage =
          error?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
        notifyError(errorMessage);
      });
  });

  // Sử dụng useWatch để theo dõi giá trị của password
  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  // Kiểm tra các yêu cầu của mật khẩu
  const isMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid =
    isMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  const renderHead = (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h3" paragraph>
        Bắt đầu ngay
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
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
          type={passwordShow.value ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify
                    icon={
                      passwordShow.value ? "carbon:view" : "carbon:view-off"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2">Mật khẩu phải chứa:</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                {isMinLength ? (
                  <Iconify icon="material-symbols:check-circle" color="green" />
                ) : (
                  <Iconify icon="material-symbols:cancel" color="red" />
                )}
              </ListItemIcon>
              <ListItemText primary="Ít nhất 8 ký tự" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {hasUpperCase ? (
                  <Iconify icon="material-symbols:check-circle" color="green" />
                ) : (
                  <Iconify icon="material-symbols:cancel" color="red" />
                )}
              </ListItemIcon>
              <ListItemText primary="Ít nhất một chữ hoa (A-Z)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {hasLowerCase ? (
                  <Iconify icon="material-symbols:check-circle" color="green" />
                ) : (
                  <Iconify icon="material-symbols:cancel" color="red" />
                )}
              </ListItemIcon>
              <ListItemText primary="Ít nhất một chữ thường (a-z)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {hasNumber ? (
                  <Iconify icon="material-symbols:check-circle" color="green" />
                ) : (
                  <Iconify icon="material-symbols:cancel" color="red" />
                )}
              </ListItemIcon>
              <ListItemText primary="Ít nhất một chữ số (0-9)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {hasSpecialChar ? (
                  <Iconify icon="material-symbols:check-circle" color="green" />
                ) : (
                  <Iconify icon="material-symbols:cancel" color="red" />
                )}
              </ListItemIcon>
              <ListItemText primary="Ít nhất một ký tự đặc biệt (!@#$%^&*)" />
            </ListItem>
          </List>
        </Box>

        <RHFTextField
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          type={confirmPasswordShow.value ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPasswordShow.onToggle} edge="end">
                  <Iconify
                    icon={
                      confirmPasswordShow.value
                        ? "carbon:view"
                        : "carbon:view-off"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {isSubmitting ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            disabled={!isPasswordValid}
          >
            Đăng ký
          </Button>
        )}
      </Stack>
    </FormProvider>
  );

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 16, mb: 4, boxShadow: 3 }}>
      <CardContent>
        {renderHead}
        <Divider sx={{ my: 2 }} />
        {renderForm}
      </CardContent>
    </Card>
  );
}
