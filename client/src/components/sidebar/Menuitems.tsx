import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },

  {
    id: uniqueId(),
    title: "Giảng Viên",
    icon: IconLayoutDashboard,
    href: "/dashboard/teacher/",
  },
  {
    id: uniqueId(),
    title: "Học viên",
    icon: IconLayoutDashboard,
    href: "/dashboard/student/",
  },
];

export default Menuitems;
