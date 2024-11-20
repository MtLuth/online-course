import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LocalizationProvider from "@/utils/localization-provider";
import ThemeProvider from "@/theme";
import { MotionLazy } from "@/components/animate/MotionLazy";
import ProgressBar from "@/components/progress-bar";
import SettingsDrawer from "@/components/settings/drawer/SettingsDrawer";
import { Toaster } from "react-hot-toast";
import AppProvider from "@/context/AppContext";
import { cookies } from "next/headers";
import { CartProvider } from "@/context/CartContext";
import { ProfileProvider } from "@/context/ProfileContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Trang Chủ | Elearning",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("accessToken");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocalizationProvider>
          <ThemeProvider>
            <AppProvider initialToken={sessionToken?.value}>
              <CartProvider>
                <ProfileProvider>
                  <MotionLazy>
                    <Toaster />
                    <ProgressBar />
                    <SettingsDrawer />
                    {children}
                  </MotionLazy>
                </ProfileProvider>
              </CartProvider>
            </AppProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
