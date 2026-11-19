import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  buildMailtoUrl,
  getMailConfigStatus,
  getRecipientEmail,
  sendContactEmail,
} from "@/lib/contact-mailer";
import {
  addInquiry,
  deleteInquiryById,
  getAllInquiries,
  type InquiryRecord,
} from "@/lib/inquiries-store";

const TYPE_LABELS: Record<"quote" | "custom" | "support", string> = {
  quote: "제품 견적 · 샘플",
  custom: "맞춤형 OEM/ODM",
  support: "엔지니어 기술지원",
};

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  const [inquiries, mailConfig] = await Promise.all([
    getAllInquiries(),
    Promise.resolve(getMailConfigStatus()),
  ]);
  return NextResponse.json({ inquiries, mailConfig });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inquiryType: "quote" | "custom" | "support" =
      body.inquiryType === "custom" || body.inquiryType === "support"
        ? body.inquiryType
        : "quote";
    const inquiryTypeLabel = TYPE_LABELS[inquiryType];
    const productModel = String(body.productModel || "").trim();
    const quantity = String(body.quantity || "1~3대 (테스트/소량)").trim();
    const selectedReqs = Array.isArray(body.selectedReqs)
      ? body.selectedReqs.map((r: unknown) => String(r).trim()).filter(Boolean)
      : [];
    const companyName = String(body.companyName || "").trim();
    const contactName = String(body.contactName || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!companyName || !contactName || !phone || !email) {
      return NextResponse.json(
        { error: "회사명, 담당자 성함, 연락처, 이메일을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const emailPayload = {
      inquiryTypeLabel,
      productModel,
      quantity,
      selectedReqs,
      companyName,
      contactName,
      phone,
      email,
      message,
    };

    const mailResult = await sendContactEmail(emailPayload);
    const mailtoUrl = buildMailtoUrl(emailPayload);

    const record: InquiryRecord = {
      id: `inq-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      createdAt: new Date().toISOString(),
      inquiryType,
      inquiryTypeLabel,
      productModel,
      quantity,
      selectedReqs,
      companyName,
      contactName,
      phone,
      email,
      message,
      recipient: getRecipientEmail(),
      emailStatus: mailResult.sent
        ? "sent"
        : mailResult.configured
          ? "failed"
          : "not_configured",
      emailProvider: mailResult.provider,
      emailError: mailResult.error,
    };

    await addInquiry(record);

    if (mailResult.configured && !mailResult.sent) {
      return NextResponse.json(
        {
          ok: false,
          saved: true,
          emailSent: false,
          configured: true,
          recipient: mailResult.recipient,
          error: mailResult.error || "메일 발송에 실패했습니다.",
          mailtoUrl,
          inquiry: record,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent: mailResult.sent,
      configured: mailResult.configured,
      recipient: mailResult.recipient,
      mailtoUrl,
      inquiry: record,
    });
  } catch (err) {
    console.error("Contact POST error:", err);
    return NextResponse.json(
      { error: "문의 접수 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id") || "";
  if (!id) {
    try {
      const body = await request.json();
      id = String(body.id || "");
    } catch {
      id = "";
    }
  }
  if (!id) {
    return NextResponse.json({ error: "삭제할 문의 ID가 필요합니다." }, { status: 400 });
  }
  const inquiries = await deleteInquiryById(id);
  return NextResponse.json({ inquiries });
}
