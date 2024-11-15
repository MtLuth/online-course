import { IconCopy, IconLayoutDashboard } from "@tabler/icons-react";

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
    href: "/dashboard/teacher/create-cource/",
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
    navlabel: true,
    subheader: "Quản Lý Website",
  },
  {
    id: uniqueId(),
    title: "Danh Sách Danh Mục",
    icon: IconCopy,
    href: "/dashboard/admin/categories/",
  },
];

export default Menuitems;
