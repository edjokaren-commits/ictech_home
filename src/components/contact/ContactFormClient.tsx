"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Phone, Mail, Clock, Send, AlertCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/company";
import { PRODUCTS } from "@/data/products";

type InquiryType = "quote" | "custom" | "support";

const INQUIRY_TYPES: { key: InquiryType; label: string; desc: string }[] = [
  { key: "quote", label: "제품 견적 · 샘플", desc: "기성 모델 단가, 납기 및 테스트 요청" },
  { key: "custom", label: "맞춤형 OEM/ODM", desc: "포트 구성, 외함, BIOS/OS 커스텀 제작" },
  { key: "support", label: "엔지니어 기술지원", desc: "호환성 검토, 드라이버, 트러블슈팅" },
];

const REQUIREMENT_OPTIONS = [
  "팬리스(무팬) 설계 필수",
  "다중 시리얼(RS-232/422/485)",
  "광온도(-20~60°C 이상)",
  "Windows IoT LTSC / UWF 세팅",
  "레거시 PCI / 특수 확장 슬롯",
  "장기 공급(5~7년) 계약 필요",
];

interface SubmitResult {
  emailSent: boolean;
  configured: boolean;
  recipient: string;
  mailtoUrl: string;
}

export default function ContactFormClient() {
  const searchParams = useSearchParams();
  const paramProduct = searchParams.get("product") ?? "";
  const paramType = searchParams.get("type");

  const [inquiryType, setInquiryType] = useState<InquiryType>(
    paramType === "custom" || paramType === "support" ? paramType : "quote"
  );
  const [productModel, setProductModel] = useState<string>(paramProduct);
  const [quantity, setQuantity] = useState<string>("1~3대 (테스트/소량)");
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (paramProduct) {
      setProductModel(paramProduct);
    }
    if (paramType === "custom" || paramType === "support" || paramType === "quote") {
      setInquiryType(paramType);
    }
  }, [paramProduct, paramType]);

  const toggleReq = (req: string) => {
    setSelectedReqs((prev) =>
      prev.includes(req) ? prev.filter((item) => item !== req) : [...prev, req]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType,
          productModel,
          quantity,
          selectedReqs,
          companyName,
          contactName,
          phone,
          email,
          message,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(
          data.error || "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
        if (data.mailtoUrl) {
          setSubmitResult({
            emailSent: false,
            configured: Boolean(data.configured),
            recipient: data.recipient || COMPANY_INFO.email,
            mailtoUrl: data.mailtoUrl,
          });
        }
        return;
      }

      setSubmitResult({
        emailSent: Boolean(data.emailSent),
        configured: Boolean(data.configured),
        recipient: data.recipient || COMPANY_INFO.email,
        mailtoUrl: data.mailtoUrl || `mailto:${COMPANY_INFO.email}`,
      });
      setSubmitted(true);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 아래 대표전화 또는 이메일로 문의해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            상담 및 견적 문의가 정상 접수되었습니다
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            <strong>{companyName || contactName}</strong>님께서 남겨주신 문의 내용이{" "}
            {submitResult?.emailSent
              ? `${submitResult.recipient}로 정상 발송되었습니다.`
              : "정상적으로 접수되었습니다."}
          </p>

          {submitResult && !submitResult.emailSent && !submitResult.configured && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left text-xs leading-relaxed text-amber-900">
              <p className="font-semibold">
                안내: 서버의 자동 메일 발송(SMTP) 설정이 아직 완료되지 않아 시스템에 문의가 저장되었습니다.
              </p>
              <p className="mt-1">
                사용 중인 메일 프로그램(Outlook 등)으로 바로 발송하시려면 아래 버튼을 눌러 주세요.
              </p>
              <a
                href={submitResult.mailtoUrl}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 font-semibold text-white transition hover:bg-amber-700"
              >
                <Mail className="h-3.5 w-3.5" />
                {submitResult.recipient}로 메일 앱에서 바로 보내기
              </a>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 text-left text-sm text-slate-700">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <span className="text-slate-400">문의 유형: </span>
                <strong className="text-slate-900">
                  {INQUIRY_TYPES.find((t) => t.key === inquiryType)?.label}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">관심 모델: </span>
                <strong className="font-mono text-slate-900">
                  {productModel || "사양 추천 요청"}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">예상 수량: </span>
                <strong className="text-slate-900">{quantity}</strong>
              </div>
              <div>
                <span className="text-slate-400">회신 연락처: </span>
                <strong className="text-slate-900">{phone}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setSubmitError(null);
            }}
            className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            추가 문의 작성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8"
        >
          {/* Step 1: Inquiry Type */}
          <div>
            <label className="block text-sm font-bold text-slate-900">
              1. 문의 유형 선택
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {INQUIRY_TYPES.map((type) => {
                const active = inquiryType === type.key;
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setInquiryType(type.key)}
                    className={`rounded-xl border p-4 text-left transition ${active
                        ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div
                      className={`text-sm font-bold ${active ? "text-blue-700" : "text-slate-900"
                        }`}
                    >
                      {type.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{type.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Product & Quantity */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="productModel" className="block text-sm font-bold text-slate-900">
                2. 관심 제품 / 모델명
              </label>
              <input
                id="productModel"
                list="ictech-models"
                type="text"
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
                placeholder="예: ICT-BOX 500F 또는 사양 추천 요청"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <datalist id="ictech-models">
                {PRODUCTS.map((p) => (
                  <option key={p.slug} value={p.modelCode}>
                    {p.name}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-bold text-slate-900">
                예상 도입 수량
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="1~3대 (테스트/소량)">1~3대 (샘플 테스트/소량)</option>
                <option value="6~20대">6~20대</option>
                <option value="21~50대">21~50대</option>
                <option value="50대 이상 (양산 계약)">50대 이상 (연간 양산 계약)</option>
              </select>
            </div>
          </div>

          {/* Step 3: Technical Checkboxes */}
          <div>
            <span className="block text-sm font-bold text-slate-900">
              3. 필수 요구 조건 (복수 선택 가능)
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {REQUIREMENT_OPTIONS.map((req) => {
                const checked = selectedReqs.includes(req);
                return (
                  <button
                    key={req}
                    type="button"
                    onClick={() => toggleReq(req)}
                    className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition ${checked
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                      }`}
                  >
                    {req}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Contact Info */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="companyName" className="block text-sm font-bold text-slate-900">
                회사명 / 소속 <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                required
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="예: (주)스마트오토메이션"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-bold text-slate-900">
                담당자 성함 / 직함 <span className="text-red-500">*</span>
              </label>
              <input
                id="contactName"
                required
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="예: 홍길동 책임"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-900">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-900">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.co.kr"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-slate-900">
              상세 문의 내용 (적용 설비, 필요 포트, 희망 납기 등)
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="예: 공장 검사 설비용 팬리스 PC가 필요하며 COM 포트 4개, LAN 2개 이상이 필요합니다. 견적서와 납기 안내 부탁드립니다."
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <div className="flex items-start gap-2 font-semibold">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
              {submitResult?.mailtoUrl && (
                <a
                  href={submitResult.mailtoUrl}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
                >
                  <Mail className="h-3.5 w-3.5" />
                  메일 앱으로 {submitResult.recipient}에 직접 발송하기
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "문의 접수 중..." : "견적 · 기술 상담 신청 완료하기"}
          </button>
        </form>

        {/* Right Contact Sidebar */}
        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl bg-slate-900 p-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              DIRECT CONTACT
            </span>
            <h2 className="mt-2 text-xl font-bold">빠른 전화 · 이메일 상담</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              긴급 설비 장애 대응이나 빠른 단가 확인이 필요하시면 직통 번호로 연락 주세요.
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <div className="font-bold">대표전화 {COMPANY_INFO.phone}</div>
                  <div className="text-xs text-slate-400">대표팩스 {COMPANY_INFO.fax}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div>
                  <div>
                    대표메일:{" "}
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="font-semibold text-sky-300 underline-offset-2 hover:underline"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="text-xs text-slate-400">{COMPANY_INFO.address}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                <div className="text-xs text-slate-300">{COMPANY_INFO.businessHours}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
