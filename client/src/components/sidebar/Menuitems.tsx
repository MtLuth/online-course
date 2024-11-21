import {
  IconLayoutDashboard,
  IconFilePlus,
  IconUserCheck,
  IconChartBar,
  IconCategory,
  IconReceiptRefund,
  IconCreditCardPay,
} from "@tabler/icons-react";
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
    href: "/dashboard/",
    roles: ["admin", "teacher"],
  },
  {
    navlabel: true,
    subheader: "Khóa học",
    roles: ["teacher"],
  },
  {
    id: uniqueId(),
    title: "Tạo khóa học",
    icon: IconFilePlus,
    href: "/dashboard/teacher/create-course/",
    roles: ["teacher"],
  },
  {
    navlabel: true,
    subheader: "Quản Lý",
    roles: ["admin"],
  },
  {
    id: uniqueId(),
    title: "Xét Duyệt Chuyên Gia",
    icon: IconUserCheck,
    href: "/dashboard/admin/teacher/",
    roles: ["admin"],
  },

  {
    navlabel: true,
    subheader: "Thống kê",
    roles: ["teacher"],
  },
  {
    id: uniqueId(),
    title: "Doanh thu khóa học",
    icon: IconChartBar,
    href: "/dashboard/teacher/incomes/",
    roles: ["teacher"],
  },
  {
    navlabel: true,
    subheader: "Quản Lý Website",
    roles: ["admin"],
  },
  {
    id: uniqueId(),
    title: "Danh Sách Danh Mục",
    icon: IconCategory,
    href: "/dashboard/admin/categories/",
    roles: ["admin"],
  },
  {
    navlabel: true,
    subheader: "Quản Lý Hoàn Tiền",
    roles: ["admin"],
  },
  {
    id: uniqueId(),
    title: "Xử Lý Hoàn Tiền",
    icon: IconReceiptRefund,
    href: "/dashboard/admin/handle-refund/",
    roles: ["admin"],
  },
  {
    id: uniqueId(),
    title: "Xử Lý Rút Tiền",
    icon: IconCreditCardPay,
    href: "/dashboard/admin/handle-withdraw/",
    roles: ["admin"],
  },
  {
    navlabel: true,
    subheader: "Ví",
    roles: ["teacher"],
  },
  {
    id: uniqueId(),
    title: "Quản Lý Ví",
    icon: WalletIcon,
    href: "/dashboard/teacher/wallet/",
    roles: ["teacher"],
  },
];

export default Menuitems;
