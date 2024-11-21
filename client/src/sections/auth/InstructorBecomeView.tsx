// src/components/InstructorBecomeView.tsx
"use client";

import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
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
import { uploadApi } from "@/server/Upload";
import { Box, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

export default function InstructorBecomeView() {
  const passwordShow = useBoolean();
  const confirmPasswordShow = useBoolean();

  const { notifySuccess, notifyError } = useToastNotification();
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      .typeError("Vui lòng nhập số năm kinh nghiệm")
      .required("Vui lòng nhập số năm kinh nghiệm")
      .min(0, "Số năm kinh nghiệm không thể nhỏ hơn 0")
      .max(100, "Số năm kinh nghiệm không thể quá 100 năm"),
    expertise: Yup.string().required("Vui lòng nhập chuyên môn"),
    education: Yup.string().required("Vui lòng nhập trình độ học vấn"),
    bio: Yup.string().max(300, "Thông tin cá nhân không được quá 300 ký tự"),
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
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
  } = methods;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setCertificateFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const onSubmit = async (data: any) => {
    if (!certificateFile) {
      setError("certificate", {
        type: "manual",
        message: "Vui lòng tải lên chứng chỉ",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadResponse = await uploadApi.uploadFile([certificateFile]);

      if (uploadResponse.status !== "Successfully") {
        throw new Error("Upload chứng chỉ thất bại");
      }

      const certificateUrl = uploadResponse.message[0];
      if (!certificateUrl) {
        throw new Error("Không thể lấy URL của chứng chỉ tải lên.");
      }
      const payload = {
        ...data,
        avt: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
        certificate: certificateUrl,
      };
      console.log(certificateUrl);
      console.log(payload);

      await authApi.becomeInstructor(payload);

      notifySuccess("Thông tin của bạn đã được gửi admin và chờ kiểm duyệt!");
      reset();
      setCertificateFile(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại sau.";
      notifyError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Render phần đầu trang
  const renderHead = (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h3" paragraph>
        Bắt đầu trở thành Chuyên Gia
      </Typography>
    </Stack>
  );

  // Render phần form
  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
            label="Giới thiệu về bản thân (*)"
            multiline
            maxRows={4}
            fullWidth
            sx={{ mb: 3 }}
          />
        </Grid>
      </Grid>

      {/* Khu vực kéo thả file chứng chỉ */}
      <Card sx={{ mt: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin chứng chỉ (*)
          </Typography>
          <Controller
            name="certificate"
            control={control}
            defaultValue={null}
            render={({ field, fieldState }) => (
              <>
                <Paper
                  {...getRootProps()}
                  elevation={isDragActive ? 8 : 2}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    color: isDragActive ? "primary.main" : "text.secondary",
                    border: "2px dashed",
                    borderColor: isDragActive ? "primary.main" : "divider",
                    backgroundColor: isDragActive
                      ? "action.hover"
                      : "background.paper",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <input {...getInputProps()} />
                  <Stack spacing={1} alignItems="center">
                    <UploadFileIcon
                      color={isDragActive ? "primary" : "action"}
                      fontSize="large"
                    />
                    {isDragActive ? (
                      <Typography>Thả file tại đây...</Typography>
                    ) : (
                      <Typography>
                        Kéo thả file tại đây hoặc nhấp để chọn file
                      </Typography>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      Chỉ chấp nhận file .pdf, .doc, .docx
                    </Typography>
                  </Stack>
                </Paper>
                {certificateFile && (
                  <Box mt={2} display="flex" alignItems="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexGrow={1}
                    >
                      <UploadFileIcon color="action" />
                      <Typography variant="body2">
                        {certificateFile.name}
                      </Typography>
                    </Stack>
                    <IconButton
                      color="error"
                      onClick={() => setCertificateFile(null)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                {fieldState.error && (
                  <Typography variant="caption" color="error">
                    {fieldState.error.message}
                  </Typography>
                )}
              </>
            )}
          />
        </CardContent>
      </Card>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || uploading}
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
