"use client";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "src/components/iconify";
import { useBoolean } from "@/hook/useBoolean";
import RouterLink from "@/routes/components/RouterLink";
import { paths } from "@/routes/path";
import FormProvider from "@/components/hook-form/FormProvider";
import RHFTextField from "@/components/hook-form/RHFTextField";
import { useState } from "react";
import { useToastNotification } from "@/hook/useToastNotification";
import { authApi } from "@/server/Auth";

export default function InstructorBecomeView() {
  const passwordShow = useBoolean();
  const confirmPasswordShow = useBoolean();

  const { notifySuccess, notifyError } = useToastNotification();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
      .required("Vui lòng nhập họ và tên")
      .min(6, "Tối thiểu 6 ký tự")
      .max(20, "Tối đa 20 ký tự"),
    email: Yup.string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu cần ít nhất 6 ký tự"),
    confirmPassword: Yup.string()
      .required("Vui lòng xác nhận mật khẩu")
      .oneOf([Yup.ref("password")], "Mật khẩu không khớp"),
    experience: Yup.number()
      .transform((value, originalValue) =>
        typeof originalValue === "string" && originalValue.trim() === ""
          ? null
          : value
      )
      .nullable()
      .required("Vui lòng nhập số năm kinh nghiệm")
      .min(0, "Số năm kinh nghiệm không thể nhỏ hơn 0")
      .max(100, "Số năm kinh nghiệm không thể quá 100 năm"),
    expertise: Yup.string().required("Vui lòng nhập chuyên môn"),
    education: Yup.string().required("Vui lòng nhập trình độ học vấn"),
    bio: Yup.string().max(300, "Thông tin cá nhân không được quá 300 ký tự"),
    certificate: Yup.string()
      .url("Vui lòng nhập URL hợp lệ")
      .required("Vui lòng nhập URL chứng chỉ"),
  });

  const defaultValues = {
    fullName: "",
    email: "",
    avt: "",
    password: "",
    confirmPassword: "",
    experience: "",
    expertise: "",
    education: "",
    bio: "",
    certificate: "",
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

  const onSubmit = handleSubmit((data) => {
    data.avt =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png";

    authApi
      .becomeInstructor(data)
      .then((res) => {
        notifySuccess("Thông tin của bạn đã được gửi admin và chờ kiểm duyệt!");
        reset();
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
        Bắt đầu trở thành Chuyên Gia
      </Typography>
    </Stack>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <RHFTextField
            name="fullName"
            label="Họ và tên (*)"
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="email"
            label="Địa chỉ email (*)"
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="password"
            label="Mật khẩu (*)"
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
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="confirmPassword"
            label="Xác nhận mật khẩu (*)"
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
            fullWidth
            sx={{ mb: 3 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RHFTextField
            name="experience"
            label="Số năm kinh nghiệm (*)"
            type="number"
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="expertise"
            label="Chuyên môn (*)"
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="education"
            label="Trình độ học vấn (*)"
            fullWidth
            sx={{ mb: 3 }}
          />
          <RHFTextField
            name="bio"
            label="Thông tin cá nhân"
            multiline
            maxRows={4}
            fullWidth
            sx={{ mb: 3 }}
          />
        </Grid>
      </Grid>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin chứng chỉ (*)
          </Typography>
          <RHFTextField
            name="certificate"
            label="URL chứng chỉ ở dạng .doc .docx .pdf"
            fullWidth
            sx={{ mb: 3 }}
          />
        </CardContent>
      </Card>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Đăng ký
      </LoadingButton>
    </FormProvider>
  );

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 2, mb: 4, boxShadow: 3 }}>
      <CardContent>
        {renderHead}
        <Divider sx={{ my: 4 }} />
        {renderForm}
      </CardContent>
    </Card>
  );
}
