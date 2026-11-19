import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import InquiriesAdminClient from "@/components/admin/InquiriesAdminClient";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getMailConfigStatus } from "@/lib/contact-mailer";
import { getAllInquiries } from "@/lib/inquiries-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "관리자 모드 · 문의 내역 및 메일 설정 | (주)아이씨테크",
  description:
    "견적 및 기술 상담 접수 내역과 ICTY@ICTECH.CO.KR 메일 발송 설정 상태를 확인합니다.",
};

export default async function AdminInquiriesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login?next=/admin/inquiries");
  }

  const [inquiries, mailConfig] = await Promise.all([
    getAllInquiries(),
    Promise.resolve(getMailConfigStatus()),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 py-12 text-white">
        <div className="bg-tech-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            ADMIN MODE · INQUIRIES &amp; MAIL
          </span>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            견적 · 기술 상담 접수 내역 및 메일 설정
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            홈페이지에서 접수된 문의 내역과 ICTY@ICTECH.CO.KR 자동 메일 발송 연동 상태를 확인합니다.
          </p>
        </div>
      </section>

      <AdminNav active="inquiries" />
      <InquiriesAdminClient initialInquiries={inquiries} mailConfig={mailConfig} />
    </div>
  );
}

