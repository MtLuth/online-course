import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
