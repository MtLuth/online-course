"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Iconify from "src/components/iconify";
import Divider from "@mui/material/Divider";
import { useBoolean } from "@/hook/useBoolean";
import RouterLink from "@/routes/components/RouterLink";
import { paths } from "@/routes/path";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { useRouter } from "@/routes/hooks/useRouter";
import { useToastNotification } from "@/hook/useToastNotification";
import { authApi } from "@/server/Auth";
import { useAppContext } from "@/context/AppContext";

export default function LoginView() {
  const passwordShow = useBoolean();
  const router = useRouter();
  const { setSessionToken, setUserRole } = useAppContext();
  const { notifySuccess, notifyError } = useToastNotification();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Vui lòng nhập email")
      .email("Địa chỉ email không hợp lệ"),
    password: Yup.string().required("Vui lòng nhập mật khẩu"),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit((data) => {
    authApi
      .login(data)
      .then((response) => {
        if (response.status === "error") {
          notifyError(response.message || "Đăng nhập không thành công");
          return;
        }
        if (response.status === "success") {
          const { tokenPairs, role } = response.message;

          // Lưu session token và role vào AppContext
          setSessionToken(tokenPairs.accessToken);
          setUserRole(role);

          notifySuccess("Đăng nhập thành công!");
          reset();
          router.push("/"); // Điều hướng về trang chính
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra. Vui lòng thử lại sau.";
        notifyError(errorMessage);
      });
  });

  const renderHead = (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h3" paragraph>
        Đăng nhập
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {`Chưa có tài khoản? `}
        <Link
          component={RouterLink}
          href={paths.register}
          variant="subtitle2"
          color="primary"
        >
          Đăng ký ngay
        </Link>
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5} alignItems="flex-end">
        <RHFTextField name="email" label="Địa chỉ email" variant="outlined" />
        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={passwordShow.value ? "text" : "password"}
          variant="outlined"
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
        <Link
          component={RouterLink}
          href={paths.forgotpassword}
          variant="body2"
          underline="always"
          color="text.secondary"
        >
          Quên mật khẩu?
        </Link>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Đăng nhập
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 16, boxShadow: 3 }}>
      <CardContent>
        {renderHead}
        <Divider sx={{ my: 2 }} />
        {renderForm}
      </CardContent>
    </Card>
  );
}
