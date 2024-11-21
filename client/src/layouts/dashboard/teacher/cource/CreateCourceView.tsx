// File: src/components/CreateCourseView.tsx

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Divider,
  Switch,
  Typography,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
  Tooltip,
  Slider, // Imported Slider for Sale Percentage
} from "@mui/material";
import {
  Add,
  Delete,
  PhotoCamera,
  Remove,
  VideoLibrary,
} from "@mui/icons-material";
import {
  Formik,
  Form,
  FieldArray,
  FormikHelpers,
  useFormikContext,
} from "formik";
import WrapperPage from "@/sections/WrapperPage";
import Image from "@/components/image";
import { uploadApi } from "@/server/Upload";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { courseApi } from "@/server/Cource";
import { useRouter } from "next/navigation";
import { useToastNotification } from "@/hook/useToastNotification";
import CategorySelect from "./CategorySelect";

// Interface Definitions
interface LectureResource {
  title: string;
  fileUrl: string;
}

interface Lecture {
  title: string;
  duration: string; // Changed to hh:mm:ss format
  type: "video" | "article";
  videoUrl: string;
  videoFile?: File | null;
  description?: string;
  resources: LectureResource[];
}

interface ContentSection {
  sectionTitle: string;
  lectures: Lecture[];
}

interface CourseData {
  title: string;
  description: string;
  category: string;
  price: number;
  sale: number; // New field for sale percentage
  salePrice: string; // New field for sale price (formatted string)
  language: string;
  level: string;
  thumbnail: string | File | null;
  requirements: string[];
  whatYouWillLearn: string[];
  content: ContentSection[];
  isPublished: boolean;
}

interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  price: number;
  sale: number; // New field
  salePrice: string; // New field for sale price
  language: string;
  level: string;
  thumbnail: string;
  requirements: string[];
  whatYouWillLearn: string[];
  content: {
    sectionTitle: string;
    lectures: {
      title: string;
      duration: string; // Changed to hh:mm:ss format
      type: "video" | "article";
      videoUrl: string;
      resources?: {
        title: string;
        fileUrl: string;
      }[];
      description?: string;
    }[];
  }[];
  isPublished: boolean;
}

interface CreateCourseViewProps {
  initialValues?: CourseData;
  isEditMode?: boolean;
  courseId?: string;
}

// Validation Schema with Sale Percentage and Duration Validation
const getValidationSchema = (isEditMode: boolean) =>
  Yup.object().shape({
    title: Yup.string().required("Tiêu đề khóa học là bắt buộc."),
    description: Yup.string().required("Mô tả khóa học là bắt buộc."),
    category: Yup.string().required("Danh mục là bắt buộc."),
    price: Yup.number()
      .required("Giá là bắt buộc.")
      .min(1, "Giá phải lớn hơn 0."),
    sale: Yup.number()
      .min(0, "Sale Percentage phải từ 0% đến 100%.")
      .max(100, "Sale Percentage phải từ 0% đến 100%.")
      .required("Sale Percentage là bắt buộc."),
    salePrice: Yup.string().required("Giá sau giảm là bắt buộc."), // Ensuring salePrice is present
    language: Yup.string()
      .oneOf(["Vietnamese"])
      .required("Ngôn ngữ là bắt buộc."),
    level: Yup.string().required("Cấp độ là bắt buộc."),
    thumbnail: isEditMode
      ? Yup.mixed()
      : Yup.mixed().required("Ảnh bìa là bắt buộc."),
    requirements: Yup.array()
      .of(Yup.string().required("Yêu cầu không được để trống."))
      .min(1, "Ít nhất một yêu cầu."),
    whatYouWillLearn: Yup.array()
      .of(Yup.string().required("Điểm học không được để trống."))
      .min(1, "Ít nhất một điểm học."),
    content: Yup.array()
      .of(
        Yup.object().shape({
          sectionTitle: Yup.string().required("Tiêu đề phần là bắt buộc."),
          lectures: Yup.array()
            .of(
              Yup.object().shape({
                title: Yup.string().required("Tiêu đề bài giảng là bắt buộc."),
                duration: Yup.string()
                  .matches(
                    /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d)$/,
                    "Thời lượng phải ở định dạng hh:mm:ss."
                  )
                  .required("Thời lượng là bắt buộc."),
                type: Yup.string()
                  .oneOf(
                    ["video", "article"],
                    "Loại bài giảng phải là video hoặc article."
                  )
                  .required("Loại bài giảng là bắt buộc."),
              })
            )
            .min(1, "Ít nhất một bài giảng."),
        })
      )
      .min(1, "Ít nhất một phần."),
  });

// Course Configuration Component
const CourseConfig: React.FC = React.memo(() => {
  const { values, errors, touched, handleChange, setFieldValue } =
    useFormikContext<CourseData>();

  // Handle Sale Percentage Change
  const handleSaleChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setFieldValue("sale", newValue as number);
    },
    [setFieldValue]
  );

  // Calculate Sale Price
  const calculatedSalePrice = useMemo(() => {
    const discountedPrice = values.price * (1 - values.sale / 100);
    return discountedPrice.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }, [values.price, values.sale]);

  // Update salePrice whenever price or sale changes
  useEffect(() => {
    setFieldValue("salePrice", calculatedSalePrice);
  }, [calculatedSalePrice, setFieldValue]);

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Course Title */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Tiêu đề khóa học"
            name="title"
            value={values.title}
            onChange={handleChange}
            fullWidth
            required
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title && errors.title}
          />
        </Grid>

        {/* Category Select */}
        <Grid item xs={12} sm={6}>
          <CategorySelect />
        </Grid>

        {/* Course Description */}
        <Grid item xs={12}>
          <TextField
            label="Mô tả khóa học"
            name="description"
            value={values.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
          />
        </Grid>

        {/* Price and Sale Percentage */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Giá (VNĐ)"
            name="price"
            type="number"
            value={values.price}
            onChange={handleChange}
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }}
            error={touched.price && Boolean(errors.price)}
            helperText={touched.price && errors.price}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Giảm giá (%)</Typography>
          <Slider
            value={values.sale}
            onChange={handleSaleChange}
            aria-labelledby="sale-percentage-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
          />
          {touched.sale && errors.sale && (
            <Typography variant="caption" color="error">
              {errors.sale}
            </Typography>
          )}

          {/* Sale Price Display */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Giá sau giảm (VNĐ)"
              name="salePrice"
              value={values.salePrice}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              error={touched.salePrice && Boolean(errors.salePrice)}
              helperText={touched.salePrice && errors.salePrice}
            />
          </Box>
        </Grid>

        {/* Language - Fixed to Vietnamese */}
        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            required
            error={touched.language && Boolean(errors.language)}
          >
            <InputLabel id="language-label">Ngôn ngữ</InputLabel>
            <Select
              labelId="language-label"
              label="Ngôn ngữ"
              name="language"
              value={values.language || "Vietnamese"} // Default to Vietnamese
              onChange={handleChange}
              disabled // Make it read-only
            >
              <MenuItem value="Vietnamese">Tiếng Việt</MenuItem>
            </Select>
            {touched.language && errors.language && (
              <Typography variant="caption" color="error">
                {errors.language}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Level */}
        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            required
            error={touched.level && Boolean(errors.level)}
          >
            <InputLabel id="level-label">Cấp độ</InputLabel>
            <Select
              labelId="level-label"
              label="Cấp độ"
              name="level"
              value={values.level}
              onChange={handleChange}
            >
              <MenuItem value="Beginner">Người mới bắt đầu</MenuItem>
              <MenuItem value="Intermediate">Trung cấp</MenuItem>
              <MenuItem value="Advanced">Nâng cao</MenuItem>
            </Select>
            {touched.level && errors.level && (
              <Typography variant="caption" color="error">
                {errors.level}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
});

// Course Image and Requirements Component
interface CourseImageRequirementsProps {
  existingThumbnailUrl?: string;
}

const CourseImageRequirements: React.FC<CourseImageRequirementsProps> =
  React.memo(({ existingThumbnailUrl }) => {
    const { values, errors, touched, setFieldValue, handleChange } =
      useFormikContext<CourseData>();

    const handleThumbnailChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
          setFieldValue("thumbnail", event.currentTarget.files[0]);
        }
      },
      [setFieldValue]
    );

    const handleRemoveThumbnail = useCallback(() => {
      setFieldValue("thumbnail", null);
    }, [setFieldValue]);

    return (
      <Box>
        <Grid container spacing={2}>
          {/* Thumbnail */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Ảnh bìa
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {(existingThumbnailUrl || values.thumbnail) && (
                <Box sx={{ position: "relative", mb: 2 }}>
                  <Image
                    src={
                      typeof values.thumbnail === "string"
                        ? values.thumbnail
                        : values.thumbnail
                        ? URL.createObjectURL(values.thumbnail)
                        : ""
                    }
                    alt="Thumbnail"
                    sx={{
                      width: 250,
                      height: 250,
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  />
                  <Tooltip title="Xóa ảnh bìa">
                    <IconButton
                      onClick={handleRemoveThumbnail}
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(255,255,255,0.7)",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.9)",
                        },
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ mr: 2 }}
                >
                  {existingThumbnailUrl || values.thumbnail
                    ? "Thay đổi"
                    : "Tải lên"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleThumbnailChange}
                  />
                </Button>
                {values.thumbnail && !(values.thumbnail instanceof File) && (
                  <Typography variant="body2">
                    {values.thumbnail instanceof File
                      ? values.thumbnail.name
                      : "Đang sử dụng ảnh bìa hiện có"}
                  </Typography>
                )}
              </Box>
            </Box>
            {touched.thumbnail && errors.thumbnail && (
              <Typography variant="caption" color="error">
                {errors.thumbnail}
              </Typography>
            )}
          </Grid>

          {/* Requirements */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Yêu cầu
            </Typography>
            <FieldArray name="requirements">
              {({ push, remove }) => (
                <Box>
                  {values.requirements.map((req, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <TextField
                        label={`Yêu cầu ${index + 1}`}
                        name={`requirements[${index}]`}
                        value={req}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={
                          touched.requirements &&
                          touched.requirements[index] &&
                          Boolean(
                            errors.requirements && errors.requirements[index]
                          )
                        }
                        helperText={
                          touched.requirements &&
                          touched.requirements[index] &&
                          errors.requirements &&
                          errors.requirements[index]
                        }
                      />
                      <IconButton
                        aria-label="remove requirement"
                        onClick={() => remove(index)}
                        disabled={values.requirements.length === 1}
                        sx={{ ml: 1 }}
                        type="button" // Ensures button does not submit the form
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => push("")}
                    type="button" // Ensures button does not submit the form
                  >
                    Thêm Yêu Cầu
                  </Button>
                </Box>
              )}
            </FieldArray>
          </Grid>

          {/* What You Will Learn */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Bạn sẽ học được gì
            </Typography>
            <FieldArray name="whatYouWillLearn">
              {({ push, remove }) => (
                <Box>
                  {values.whatYouWillLearn.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <TextField
                        label={`Điểm học ${index + 1}`}
                        name={`whatYouWillLearn[${index}]`}
                        value={item}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={
                          touched.whatYouWillLearn &&
                          touched.whatYouWillLearn[index] &&
                          Boolean(
                            errors.whatYouWillLearn &&
                              errors.whatYouWillLearn[index]
                          )
                        }
                        helperText={
                          touched.whatYouWillLearn &&
                          touched.whatYouWillLearn[index] &&
                          errors.whatYouWillLearn &&
                          errors.whatYouWillLearn[index]
                        }
                      />
                      <IconButton
                        aria-label="remove what you will learn"
                        onClick={() => remove(index)}
                        disabled={values.whatYouWillLearn.length === 1}
                        sx={{ ml: 1 }}
                        type="button" // Ensures button does not submit the form
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => push("")}
                    type="button" // Ensures button does not submit the form
                  >
                    Thêm Điều Bạn Sẽ Học
                  </Button>
                </Box>
              )}
            </FieldArray>
          </Grid>
        </Grid>
      </Box>
    );
  });

// Lecture Item Component with Duration Picker
interface LectureProps {
  sectionIndex: number;
  lectureIndex: number;
  removeLecture: (index: number) => void;
}

const LectureItem: React.FC<LectureProps> = React.memo(
  ({ sectionIndex, lectureIndex, removeLecture }) => {
    const { values, errors, touched, handleChange, setFieldValue } =
      useFormikContext<CourseData>();

    const lecture = values.content[sectionIndex].lectures[lectureIndex];
    const lectureErrors =
      (errors.content &&
        errors.content[sectionIndex] &&
        errors.content[sectionIndex].lectures &&
        errors.content[sectionIndex].lectures[lectureIndex]) ||
      {};
    const lectureTouched =
      (touched.content &&
        touched.content[sectionIndex] &&
        touched.content[sectionIndex].lectures &&
        touched.content[sectionIndex].lectures[lectureIndex]) ||
      {};

    // Handle Video File Change
    const handleVideoChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
          setFieldValue(
            `content[${sectionIndex}].lectures[${lectureIndex}].videoFile`,
            file
          );
          const videoUrl = URL.createObjectURL(file);
          setFieldValue(
            `content[${sectionIndex}].lectures[${lectureIndex}].videoUrl`,
            videoUrl
          );
        }
      },
      [setFieldValue, sectionIndex, lectureIndex]
    );

    // Handle Remove Video
    const handleRemoveVideo = useCallback(() => {
      setFieldValue(
        `content[${sectionIndex}].lectures[${lectureIndex}].videoFile`,
        null
      );
      setFieldValue(
        `content[${sectionIndex}].lectures[${lectureIndex}].videoUrl`,
        ""
      );
    }, [setFieldValue, sectionIndex, lectureIndex]);

    return (
      <Paper
        sx={{
          border: "1px solid #ccc",
          p: 2,
          mb: 2,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
        elevation={1}
      >
        <Grid container spacing={2}>
          {/* Lecture Title */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tiêu đề bài giảng"
              name={`content[${sectionIndex}].lectures[${lectureIndex}].title`}
              value={lecture.title}
              onChange={handleChange}
              fullWidth
              required
              error={lectureTouched.title && Boolean(lectureErrors.title)}
              helperText={lectureTouched.title && lectureErrors.title}
            />
          </Grid>

          {/* Duration Picker */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Thời lượng (hh:mm:ss)"
              name={`content[${sectionIndex}].lectures[${lectureIndex}].duration`}
              value={lecture.duration}
              onChange={handleChange}
              fullWidth
              required
              placeholder="00:00:00"
              error={lectureTouched.duration && Boolean(lectureErrors.duration)}
              helperText={lectureTouched.duration && lectureErrors.duration}
              inputProps={{
                pattern: "^([0-1]?\\d|2[0-3]):([0-5]?\\d):([0-5]?\\d)$",
              }}
            />
          </Grid>

          {/* Type */}
          <Grid item xs={12} sm={3}>
            <FormControl
              fullWidth
              required
              error={lectureTouched.type && Boolean(lectureErrors.type)}
            >
              <InputLabel id={`type-label-${sectionIndex}-${lectureIndex}`}>
                Loại
              </InputLabel>
              <Select
                labelId={`type-label-${sectionIndex}-${lectureIndex}`}
                label="Loại"
                name={`content[${sectionIndex}].lectures[${lectureIndex}].type`}
                value={lecture.type}
                onChange={handleChange}
              >
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="article">Chữ</MenuItem>
              </Select>
              {lectureTouched.type && lectureErrors.type && (
                <Typography variant="caption" color="error">
                  {lectureErrors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Video Upload Section */}
          {lecture.type === "video" && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Video hiện có:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                {/* Video Preview */}
                {lecture.videoUrl && (
                  <Box sx={{ position: "relative", mb: 2 }}>
                    <video
                      width="250"
                      height="200"
                      controls
                      src={lecture.videoUrl}
                      style={{
                        borderRadius: 8,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    {/* Remove Video Button */}
                    <Tooltip title="Xóa video">
                      <IconButton
                        onClick={handleRemoveVideo}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.9)",
                          },
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* Upload/Change Video Button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<VideoLibrary />}
                    sx={{ mr: 2 }}
                    type="button" // Ensures button does not submit the form
                  >
                    {lecture.videoUrl ? "Thay đổi Video" : "Tải Video"}
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleVideoChange}
                    />
                  </Button>
                  {/* Display Selected Video Name */}
                  {lecture.videoFile && (
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {lecture.videoFile.name}
                    </Typography>
                  )}
                </Box>
              </Box>
              {/* Video Upload Error */}
              {lectureTouched.videoUrl && lectureErrors.videoUrl && (
                <Typography variant="caption" color="error">
                  {lectureErrors.videoUrl}
                </Typography>
              )}
            </Grid>
          )}

          {/* Article Description Section */}
          {lecture.type === "article" && (
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                name={`content[${sectionIndex}].lectures[${lectureIndex}].description`}
                value={lecture.description || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
                error={
                  lectureTouched.description &&
                  Boolean(lectureErrors.description)
                }
                helperText={
                  lectureTouched.description && lectureErrors.description
                }
              />
            </Grid>
          )}

          {/* Resources Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Tài nguyên (tùy chọn)
            </Typography>
            <FieldArray
              name={`content[${sectionIndex}].lectures[${lectureIndex}].resources`}
            >
              {({ push, remove }) => (
                <Box>
                  {lecture.resources.map((resource, resourceIndex) => {
                    const resourceError =
                      lectureErrors.resources?.[resourceIndex] || {};
                    const resourceTouched =
                      lectureTouched.resources?.[resourceIndex] || {};
                    return (
                      <Box
                        key={resourceIndex}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <TextField
                          label={`Tên tài nguyên ${resourceIndex + 1}`}
                          name={`content[${sectionIndex}].lectures[${lectureIndex}].resources[${resourceIndex}].title`}
                          value={resource.title}
                          onChange={handleChange}
                          fullWidth
                          error={
                            resourceTouched.title &&
                            Boolean(resourceError.title)
                          }
                          helperText={
                            resourceTouched.title && resourceError.title
                          }
                        />
                        <TextField
                          label="URL Tài nguyên"
                          name={`content[${sectionIndex}].lectures[${lectureIndex}].resources[${resourceIndex}].fileUrl`}
                          value={resource.fileUrl}
                          onChange={handleChange}
                          fullWidth
                          sx={{ ml: 2 }}
                          error={
                            resourceTouched.fileUrl &&
                            Boolean(resourceError.fileUrl)
                          }
                          helperText={
                            resourceTouched.fileUrl && resourceError.fileUrl
                          }
                        />
                        <IconButton
                          aria-label="remove resource"
                          onClick={() => remove(resourceIndex)}
                          disabled={lecture.resources.length === 0}
                          sx={{ ml: 1 }}
                          type="button" // Ensures button does not submit the form
                        >
                          <Remove />
                        </IconButton>
                      </Box>
                    );
                  })}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => push({ title: "", fileUrl: "" })}
                    type="button" // Ensures button does not submit the form
                  >
                    Thêm Tài nguyên
                  </Button>
                </Box>
              )}
            </FieldArray>
          </Grid>
        </Grid>
        {/* Remove Lecture Button */}
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Remove />}
            onClick={() => removeLecture(lectureIndex)}
            disabled={values.content[sectionIndex].lectures.length === 1}
            type="button" // Ensures button does not submit the form
          >
            Xóa Bài giảng
          </Button>
        </Box>
      </Paper>
    );
  }
);

// Content Section Component
interface SectionProps {
  sectionIndex: number;
  removeSection: (index: number) => void;
}

const ContentSectionComponent: React.FC<SectionProps> = React.memo(
  ({ sectionIndex, removeSection }) => {
    const { values, errors, touched, handleChange } =
      useFormikContext<CourseData>();
    const section = values.content[sectionIndex];
    const sectionErrors =
      (errors.content && errors.content[sectionIndex]) || {};
    const sectionTouched =
      (touched.content && touched.content[sectionIndex]) || {};

    return (
      <Paper
        sx={{
          p: 2,
          mb: 2,
          position: "relative",
        }}
        elevation={3}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            label={`Tiêu đề phần ${sectionIndex + 1}`}
            name={`content[${sectionIndex}].sectionTitle`}
            value={section.sectionTitle}
            onChange={handleChange}
            fullWidth
            required
            error={
              sectionTouched.sectionTitle && Boolean(sectionErrors.sectionTitle)
            }
            helperText={
              sectionTouched.sectionTitle && sectionErrors.sectionTitle
            }
          />
          <IconButton
            aria-label="remove section"
            onClick={() => removeSection(sectionIndex)}
            disabled={values.content.length === 1}
            type="button" // Ensures button does not submit the form
          >
            <Remove />
          </IconButton>
        </Box>

        <FieldArray name={`content[${sectionIndex}].lectures`}>
          {({ push, remove }) => (
            <Box>
              {section.lectures.map((_, lectureIndex) => (
                <LectureItem
                  key={lectureIndex}
                  sectionIndex={sectionIndex}
                  lectureIndex={lectureIndex}
                  removeLecture={remove}
                />
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() =>
                  push({
                    title: "",
                    duration: "00:00:00",
                    type: "video",
                    videoUrl: "",
                    videoFile: null,
                    description: "",
                    resources: [],
                  })
                }
                type="button" // Ensures button does not submit the form
              >
                Thêm Bài giảng
              </Button>
            </Box>
          )}
        </FieldArray>
      </Paper>
    );
  }
);

// Course Content Component
const CourseContent: React.FC = React.memo(() => {
  const { values } = useFormikContext<CourseData>();

  return (
    <Box>
      <FieldArray name="content">
        {({ push, remove }) => (
          <Box>
            {values.content.map((_, sectionIndex) => (
              <ContentSectionComponent
                key={sectionIndex}
                sectionIndex={sectionIndex}
                removeSection={remove}
              />
            ))}
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() =>
                push({
                  sectionTitle: "",
                  lectures: [
                    {
                      title: "",
                      duration: "00:00:00",
                      type: "video",
                      videoUrl: "",
                      videoFile: null,
                      description: "",
                      resources: [],
                    },
                  ],
                })
              }
              type="button" // Ensures button does not submit the form
            >
              Thêm Phần
            </Button>
          </Box>
        )}
      </FieldArray>
    </Box>
  );
});

// Main CreateCourseView Component
const CreateCourseView: React.FC<CreateCourseViewProps> = ({
  initialValues,
  isEditMode = false,
  courseId,
}) => {
  const router = useRouter();
  const { notifySuccess, notifyError } = useToastNotification();
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<
    string | undefined
  >(
    isEditMode && initialValues && typeof initialValues.thumbnail === "string"
      ? initialValues.thumbnail
      : undefined
  );

  // Handle Form Submission
  const handleSubmit = useCallback(
    async (values: CourseData, actions: FormikHelpers<CourseData>) => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập.");
        }

        // Upload Thumbnail if it's a file
        let thumbnailUrl = "";
        if (values.thumbnail instanceof File) {
          const uploadImageResponse = await uploadApi.uploadImages(
            [values.thumbnail],
            token
          );

          if (
            uploadImageResponse.status === "Successfully" &&
            typeof uploadImageResponse.message === "string"
          ) {
            thumbnailUrl = uploadImageResponse.message;
          } else {
            throw new Error(
              uploadImageResponse.message || "Tải lên ảnh bìa thất bại."
            );
          }
        } else if (isEditMode && existingThumbnailUrl) {
          thumbnailUrl = existingThumbnailUrl;
        } else {
          throw new Error("Thumbnail is required.");
        }

        // Upload Videos
        const videoFiles: File[] = [];

        values.content.forEach((section) => {
          section.lectures.forEach((lecture) => {
            if (lecture.type === "video" && lecture.videoFile) {
              videoFiles.push(lecture.videoFile);
            }
          });
        });

        let videoUrls: string[] = [];
        if (videoFiles.length > 0) {
          const uploadVideoResponse = await uploadApi.uploadVideos(
            videoFiles,
            token
          );

          if (
            uploadVideoResponse.status === "Successfully" &&
            Array.isArray(uploadVideoResponse.message)
          ) {
            videoUrls = uploadVideoResponse.message;
          } else {
            throw new Error(
              uploadVideoResponse.message || "Tải lên video thất bại."
            );
          }
        }

        // Assign uploaded video URLs to lectures
        let videoUrlIndex = 0;
        const updatedContent = values.content.map((section) => {
          const updatedLectures = section.lectures.map((lecture) => {
            if (lecture.type === "video" && lecture.videoFile) {
              const uploadedUrl = videoUrls[videoUrlIndex++];
              return {
                ...lecture,
                videoUrl: uploadedUrl,
                videoFile: null,
              };
            } else if (lecture.type === "article" && lecture.description) {
              return {
                ...lecture,
                videoUrl: "", // Optional: handle as needed
                description: lecture.description,
              };
            }
            return lecture;
          });
          return { ...section, lectures: updatedLectures };
        });

        // Prepare data for submission
        const completeCourseData: CreateCourseData = {
          ...values,
          thumbnail: thumbnailUrl,
          sale: values.sale / 100, // Convert to 0-1 scale
          salePrice: (values.price * (1 - values.sale / 100)).toLocaleString(
            "vi-VN",
            {
              style: "currency",
              currency: "VND",
            }
          ), // Ensure salePrice is correctly formatted
          content: updatedContent,
        };

        let response;
        if (isEditMode && courseId) {
          // Call API to update course
          response = await courseApi.updateCourse(
            courseId,
            completeCourseData,
            token
          );
        } else {
          // Call API to create course
          response = await courseApi.createCourse(completeCourseData, token);
        }

        if (response.status === "Successfully") {
          notifySuccess(
            isEditMode
              ? "Khóa học đã được cập nhật thành công!"
              : "Khóa học đã được tạo thành công!"
          );
          actions.resetForm();
          if (isEditMode && courseId) {
            router.push(`/my-courses`); // Navigate to My Courses
          }
        } else {
          throw new Error(
            response.message ||
              (isEditMode
                ? "Cập nhật khóa học thất bại."
                : "Tạo khóa học thất bại.")
          );
        }
      } catch (error: any) {
        console.error("Lỗi khi tạo/chỉnh sửa khóa học:", error);
        notifyError(
          error.message ||
            "Có lỗi xảy ra khi tạo/chỉnh sửa khóa học. Vui lòng thử lại."
        );
      } finally {
        actions.setSubmitting(false);
      }
    },
    [
      isEditMode,
      courseId,
      existingThumbnailUrl,
      router,
      notifySuccess,
      notifyError,
    ]
  );

  // Initial Form Values with Sale Percentage and Sale Price
  const initialFormValues: CourseData = useMemo(
    () =>
      initialValues || {
        title: "",
        description: "",
        category: "",
        price: 0,
        sale: 0,
        salePrice: "₫0",
        language: "Vietnamese",
        level: "",
        thumbnail: null,
        requirements: [""],
        whatYouWillLearn: [""],
        content: [
          {
            sectionTitle: "",
            lectures: [
              {
                title: "",
                duration: "00:00:00", // Default duration
                type: "video",
                videoUrl: "",
                videoFile: null,
                description: "",
                resources: [],
              },
            ],
          },
        ],
        isPublished: false,
      },
    [initialValues]
  );

  return (
    <WrapperPage title={isEditMode ? "Chỉnh sửa Khóa Học" : "Tạo Khóa Học"}>
      <Formik
        initialValues={initialFormValues}
        validationSchema={getValidationSchema(isEditMode)}
        onSubmit={handleSubmit}
        enableReinitialize // Allows Formik to update initialValues when props change
        context={{ isEditMode }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          isSubmitting,
          validateForm,
          setTouched,
        }) => {
          const [activeTab, setActiveTab] = useState<number>(0);

          // Handle Tab Change
          const handleTabChange = useCallback(
            (event: React.SyntheticEvent, newValue: number) => {
              setActiveTab(newValue);
            },
            []
          );

          // Handle Next Button Click
          const handleNext = useCallback(async () => {
            const tabs = [
              [
                "title",
                "description",
                "category",
                "price",
                "sale",
                "language",
                "level",
              ],
              ["thumbnail", "requirements", "whatYouWillLearn"],
              ["content"],
            ];

            const fieldsToValidate = tabs[activeTab];
            await setTouched(
              fieldsToValidate.reduce((acc, field) => {
                acc[field as keyof CourseData] = true;
                return acc;
              }, {} as { [field: string]: boolean })
            );

            const formErrors = await validateForm();

            const hasErrors = fieldsToValidate.some((field) => {
              if (field === "thumbnail") {
                return !!formErrors.thumbnail;
              }
              if (field === "content") {
                return !!formErrors.content;
              }
              return !!formErrors[field as keyof CourseData];
            });

            if (!hasErrors) {
              setActiveTab((prev) => prev + 1);
            }
          }, [activeTab, setTouched, validateForm]);

          // Handle Previous Button Click
          const handlePrevious = useCallback(() => {
            setActiveTab((prev) => prev - 1);
          }, []);

          return (
            <Form>
              {/* Tabs and Publish Switch */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Cấu Hình" />
                  <Tab label="Hình Ảnh & Yêu Cầu" />
                  <Tab label="Nội Dung" />
                </Tabs>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Xuất bản
                  </Typography>
                  <Switch
                    checked={values.isPublished}
                    onChange={(e) =>
                      setFieldValue("isPublished", e.target.checked)
                    }
                    color="primary"
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Tab Content */}
              <Box>
                {activeTab === 0 && <CourseConfig />}
                {activeTab === 1 && (
                  <CourseImageRequirements
                    existingThumbnailUrl={
                      isEditMode && typeof initialValues?.thumbnail === "string"
                        ? initialValues.thumbnail
                        : undefined
                    }
                  />
                )}
                {activeTab === 2 && <CourseContent />}
              </Box>

              {/* Navigation Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handlePrevious}
                  disabled={activeTab === 0}
                  type="button" // Ensures button does not submit the form
                >
                  Trước
                </Button>
                {activeTab < 2 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    type="button" // Ensures button does not submit the form
                  >
                    Tiếp theo
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit" // Only the submit button submits the form
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          color="inherit"
                          sx={{ mr: 1 }}
                        />
                        Đang {isEditMode ? "cập nhật..." : "tạo..."}
                      </>
                    ) : isEditMode ? (
                      "Cập nhật Khóa Học"
                    ) : (
                      "Tạo Khóa Học"
                    )}
                  </Button>
                )}
              </Box>

              {isEditMode && (
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => router.push("/my-courses")}
                    type="button" // Ensures button does not submit the form
                  >
                    Quay lại My Courses
                  </Button>
                </Box>
              )}
            </Form>
          );
        }}
      </Formik>
    </WrapperPage>
  );
};

export default CreateCourseView;
