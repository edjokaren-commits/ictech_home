import type { Metadata } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "아이씨테크(ICTech) | 산업용 컴퓨터 · 산업용 메인보드 · 맞춤형 임베디드 전문",
  description:
    "멈추지 않는 현장을 위한 최적의 설계. 팬리스 산업용 컴퓨터, 장기 공급 산업용 메인보드, OEM/ODM 맞춤 제작 및 전담 엔지니어 기술지원을 제공합니다.",
  icons: {
    icon: "/images/ICT_CI_NV_symbol1.png",
    apple: "/images/ICT_CI_NV_symbol1.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isAdminAuthenticated();

  return (
    <html lang="ko" className={`${notoSansKr.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <Header isAdmin={isAdmin} />
        <main>{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}

