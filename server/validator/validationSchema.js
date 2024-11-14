import yup from "yup";
import YupPassword from "yup-password";
import ErrorMessage from "../messages/errorMessage.js";

YupPassword(yup);

const loginParam = yup.object().shape({
  email: yup
    .string()
    .required(ErrorMessage.EmailIsRequired)
    .email(ErrorMessage.EmailInvalid),
  password: yup.string().required(ErrorMessage.PasswordIsRequired),
});

const registerParam = yup.object().shape({
  email: yup
    .string()
    .required(ErrorMessage.EmailIsRequired)
    .email(ErrorMessage.EmailInvalid),
  password: yup.string().password().required(ErrorMessage.PasswordIsRequired),
  confirmPassword: yup
    .string()
    .label("confirm password")
    .required(ErrorMessage.ConfirmPasswordIsRequired)
    .oneOf([yup.ref("password"), null], ErrorMessage.PasswordNotMatch),
  fullName: yup
    .string()
    .label("full name")
    .required(ErrorMessage.FullNameIsRequired),
  phoneNumber: yup
    .string()
    .label("phone number")
    .required(ErrorMessage.PhoneNumberIsRequired),
});

const becomeInstructorParam = yup.object().shape({
  email: yup
    .string()
    .email(ErrorMessage.InvalidEmail)
    .required(ErrorMessage.EmailIsRequired),
  password: yup.string().password().required(ErrorMessage.PasswordIsRequired),
  confirmPassword: yup
    .string()
    .label("confirm password")
    .required(ErrorMessage.ConfirmPasswordIsRequired)
    .oneOf([yup.ref("password"), null], ErrorMessage.PasswordNotMatch),
  fullName: yup.string().label("full name").required(),
  bio: yup.string().required(),
  certificate: yup.string().required(),
  education: yup.string().required(),
  expertise: yup.string().required(),
  experience: yup.number().min(1).required(),
  avt: yup.string().required(),
});

const courseValidationSchema = yup.object({
  title: yup
    .string()
    .required("Tên khóa học là bắt buộc")
    .min(5, "Tên khóa học phải có ít nhất 5 ký tự")
    .max(100, "Tên khóa học không được vượt quá 100 ký tự"),

  description: yup
    .string()
    .required("Mô tả khóa học là bắt buộc")
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự"),

  category: yup.string().required("Danh mục là bắt buộc"),
  price: yup
    .number()
    .required("Giá của khóa học là bắt buộc")
    .min(0, "Giá không được nhỏ hơn 0"),
  //   discount: yup.number()
  //     .min(0, "Giảm giá không thể nhỏ hơn 0")
  //     .max(100, "Giảm giá không thể lớn hơn 100"),
  language: yup.string().required("Ngôn ngữ của khóa học là bắt buộc"),
  //   rating: yup.number().min(1).max(5),
  //   numberOfRatings: yup.number().min(0),
  level: yup
    .string()
    .oneOf(["Beginner", "Intermediate", "Advanced"])
    .required("Trình độ là bắt buộc"),
  thumbnail: yup
    .string()
    .url("URL ảnh không hợp lệ")
    .required("Ảnh đại diện của khóa học là bắt buộc"),
  createdAt: yup.date().default(() => new Date()),
  updatedAt: yup.date().default(() => new Date()),

  requirements: yup
    .array()
    .of(yup.string())
    .min(1, "Phải có ít nhất một yêu cầu cho khóa học"),

  whatYouWillLearn: yup
    .array()
    .of(yup.string())
    .min(1, "Phải có ít nhất một nội dung học được cho khóa học"),

  content: yup
    .array()
    .of(
      yup.object({
        sectionTitle: yup.string().required("Tên của phần là bắt buộc"),
        lectures: yup
          .array()
          .of(
            yup.object({
              title: yup.string().required("Tên bài giảng là bắt buộc"),
              duration: yup
                .string()
                .required("Thời lượng bài giảng là bắt buộc"),
              type: yup
                .string()
                .oneOf(["video", "article"])
                .required("Loại bài giảng là bắt buộc"),
              videoUrl: yup.string(),
              resources: yup.array().of(
                yup.object({
                  title: yup.string().required("Tên tài nguyên là bắt buộc"),
                  fileUrl: yup
                    .string()
                    .url("URL tài nguyên không hợp lệ")
                    .required("URL tài nguyên là bắt buộc"),
                })
              ),
            })
          )
          .min(1, "Mỗi phần phải có ít nhất một bài giảng"),
      })
    )
    .min(1, "Khóa học phải có ít nhất một phần nội dung"),

  //   reviews: yup.array().of(
  //     yup.object({
  //       userId: yup.string().required("ID người dùng là bắt buộc"),
  //       userName: yup.string().required("Tên người dùng là bắt buộc"),
  //       rating: yup.number().min(1).max(5).required("Đánh giá là bắt buộc"),
  //       comment: yup.string().max(500),
  //       createdAt: yup.date().default(() => new Date()),
  //     })
  //   ),

  //   studentsEnrolled: yup.array().of(yup.string()).min(1),
  isPublished: yup.boolean().default(false),
});

const buyCoursesSchema = yup
  .array()
  .of(yup.string())
  .required("Vui lòng chọn sản phẩm muốn mua!")
  .min(1, "Phải có ít nhất 1 khóa học");

const createPaymentLinkSchema = yup
  .array()
  .of(
    yup.object({
      name: yup.string().required("Tên sản phẩm là bắt buộc"),
      quantity: yup
        .number()
        .required("Số lượng là bắt buộc")
        .min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
      price: yup.number().required("Giá là bắt buộc"),
    })
  )
  .required("items is required")
  .min(1, "Vui lòng chọn ít nhất một sản phẩm muốn mua");

export {
  loginParam,
  registerParam,
  becomeInstructorParam,
  courseValidationSchema,
  buyCoursesSchema,
  createPaymentLinkSchema,
};
