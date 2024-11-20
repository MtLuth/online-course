import { IconCopy, IconLayoutDashboard } from "@tabler/icons-react";
import WalletIcon from "@mui/icons-material/Wallet";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Trang chủ",
  },

  {
    id: uniqueId(),
    title: "Bảng điều khiển",
    icon: IconLayoutDashboard,
    href: "/dashboard/admin/teacher",
  },
  {
    navlabel: true,
    subheader: "Khóa học",
  },

  {
    id: uniqueId(),
    title: "Tạo khóa học",
    icon: IconCopy,
    href: "/dashboard/teacher/create-course/",
  },
  {
    navlabel: true,
    subheader: "Quản Lý",
  },
  {
    id: uniqueId(),
    title: "Xét Duyệt Chuyên Gia",
    icon: IconCopy,
    href: "/dashboard/admin/teacher/",
  },
  {
    id: uniqueId(),
    title: "Quản Lý Ví",
    icon: WalletIcon,
    href: "/dashboard/wallet/",
  },
  {
    navlabel: true,
    subheader: "Quản Lý Website",
  },
  {
    id: uniqueId(),
    title: "Danh Sách Danh Mục",
    icon: IconCopy,
    href: "/dashboard/admin/categories/",
  },
  {
    navlabel: true,
    subheader: "Quản Lý Hoàn Tiền",
  },
  {
    id: uniqueId(),
    title: "Xử Lý Yêu Cầu",
    icon: IconCopy,
    href: "/dashboard/admin/handle-refund/",
  },
];

export default Menuitems;
