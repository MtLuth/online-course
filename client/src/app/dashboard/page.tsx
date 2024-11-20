import React from "react";
import AdminDashboard from "@/sections/admin/HandleDashboardA";
import InstructorDashboard from "@/sections/teacher/InstructorDashboard";
import { cookies } from "next/headers";

export default function RefundRequest() {
  const cookieStore = cookies();
  const role = cookieStore.get("role")?.value;

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "teacher") {
    return <InstructorDashboard />;
  }
  return <div>Không có quyền truy cập hoặc role không hợp lệ.</div>;
}
