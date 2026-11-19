"use client";

import { useState } from "react";
import { Mail, Trash2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { InquiryRecord } from "@/lib/inquiries-store";
import type { MailConfigStatus } from "@/lib/contact-mailer";

export default function InquiriesAdminClient({
  initialInquiries,
  mailConfig,
}: {
  initialInquiries: InquiryRecord[];
  mailConfig: MailConfigStatus;
}) {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>(initialInquiries);

  const handleDelete = async (id: string) => {
    if (!window.confirm("이 문의 내역을 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok && Array.isArray(data.inquiries)) {
      setInquiries(data.inquiries);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      {/* Mail Config Diagnostic Card */}
      <div
        className={`rounded-2xl border p-6 ${
          mailConfig.configured
            ? "border-emerald-200 bg-emerald-50/70"
            : "border-amber-200 bg-amber-50/80"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Mail
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                mailConfig.configured ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                수신 메일 설정 상태 ({mailConfig.recipient})
              </h2>
              {mailConfig.configured ? (
                <p className="mt-1 text-sm text-emerald-800">
                  자동 발송 활성화됨 ({mailConfig.provider.toUpperCase()}
                  {mailConfig.smtpHost ? ` · ${mailConfig.smtpHost}:${mailConfig.smtpPort}` : ""}
                  {mailConfig.smtpUserMasked ? ` · 계정 ${mailConfig.smtpUserMasked}` : ""})
                </p>
              ) : (
                <div className="mt-1 space-y-2 text-xs leading-relaxed text-amber-900 sm:text-sm">
                  <p>
                    현재 <strong>.env.local</strong>에 SMTP 또는 RESEND_API_KEY가 설정되어 있지 않아
                    홈페이지 문의 접수 시 <strong>{mailConfig.recipient}</strong>로 자동 SMTP 발송이
                    대기 상태입니다. (모든 문의 내역은 아래 목록 및{" "}
                    <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs">
                      data/inquiries.json
                    </code>
                    에 저장됩니다.)
                  </p>
                  <pre className="overflow-x-auto rounded-xl border border-amber-200 bg-white p-3 font-mono text-xs text-slate-800">
{`# .env.local 파일에 아래 항목을 입력 후 서버를 재시작하세요
CONTACT_TO_EMAIL=ICTY@ICTECH.CO.KR
SMTP_HOST=smtp.hiworks.com   # 사용 중인 메일 서버 (예: smtp.gmail.com, smtp.worksmobile.com)
SMTP_PORT=465                # SSL: 465 / STARTTLS: 587
SMTP_SECURE=true             # 465면 true, 587이면 false
SMTP_USER=발신계정@ictech.co.kr
SMTP_PASS=메일계정_비밀번호_또는_앱비밀번호`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Inquiries Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">
            접수된 견적 · 기술 상담 내역 ({inquiries.length}건)
          </h2>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            아직 접수된 문의 내역이 없습니다.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-blue-200"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">
                        {inq.inquiryTypeLabel}
                      </span>
                      <span className="font-mono text-slate-500">
                        {new Date(inq.createdAt).toLocaleString("ko-KR")}
                      </span>
                      {inq.emailStatus === "sent" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          {inq.recipient} 발송 완료
                        </span>
                      )}
                      {inq.emailStatus === "not_configured" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-800">
                          <AlertTriangle className="h-3 w-3" />
                          SMTP 미설정 (DB 저장만 완료)
                        </span>
                      )}
                      {inq.emailStatus === "failed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 font-semibold text-red-700">
                          <XCircle className="h-3 w-3" />
                          발송 실패: {inq.emailError}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-base font-bold text-slate-900">
                      {inq.companyName} · {inq.contactName}{" "}
                      <span className="font-normal text-slate-500">
                        ({inq.phone} / {inq.email})
                      </span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-red-600 hover:border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    삭제
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                  <span>
                    관심 모델:{" "}
                    <strong className="font-mono text-slate-900">
                      {inq.productModel || "사양 추천 요청"}
                    </strong>
                  </span>
                  <span>
                    예상 수량: <strong className="text-slate-900">{inq.quantity}</strong>
                  </span>
                  {inq.selectedReqs.length > 0 && (
                    <span>요구 조건: {inq.selectedReqs.join(", ")}</span>
                  )}
                </div>

                {inq.message && (
                  <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                    {inq.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

