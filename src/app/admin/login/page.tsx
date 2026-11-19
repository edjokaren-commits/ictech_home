import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminLoginClient from "@/components/admin/AdminLoginClient";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 로그인 | (주)아이씨테크",
  description: "아이씨테크 제품 카탈로그 관리 전용 로그인 페이지입니다.",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/products");
  }

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <Suspense
        fallback={
          <div className="mx-auto max-w-md px-4 py-20 text-center text-sm text-slate-500">
            로그인 화면을 불러오는 중입니다...
          </div>
        }
      >
        <AdminLoginClient />
      </Suspense>
    </div>
  );
}
