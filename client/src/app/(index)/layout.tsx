'use client';

import MainLayout from "@/layouts/main/MainLayout";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return <MainLayout disabledSpacing>{children}</MainLayout>;
}