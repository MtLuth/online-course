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
    href: "/dashboard/teacher/",
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
];

export default Menuitems;
