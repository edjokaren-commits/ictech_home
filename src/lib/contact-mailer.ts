import nodemailer from "nodemailer";

export interface ContactEmailPayload {
  inquiryTypeLabel: string;
  productModel: string;
  quantity: string;
  selectedReqs: string[];
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  message: string;
}

export interface MailConfigStatus {
  configured: boolean;
  provider: "smtp" | "resend" | "none";
  recipient: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUserMasked?: string;
}

export interface SendMailResult {
  sent: boolean;
  configured: boolean;
  provider: "smtp" | "resend" | "none";
  recipient: string;
  error?: string;
}

export const DEFAULT_CONTACT_RECIPIENT = "ICTY@ICTECH.CO.KR";

export function getRecipientEmail(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_RECIPIENT;
}

function maskEmailOrUser(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.length <= 4) return "****";
  return `${trimmed.slice(0, 3)}***${trimmed.slice(-4)}`;
}

export function getMailConfigStatus(): MailConfigStatus {
  const recipient = getRecipientEmail();
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);

  if (smtpHost && smtpUser && smtpPass) {
    return {
      configured: true,
      provider: "smtp",
      recipient,
      smtpHost,
      smtpPort: Number.isFinite(smtpPort) ? smtpPort : 587,
      smtpUserMasked: maskEmailOrUser(smtpUser),
    };
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return {
      configured: true,
      provider: "resend",
      recipient,
    };
  }

  return {
    configured: false,
    provider: "none",
    recipient,
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailContent(payload: ContactEmailPayload) {
  const subject = `[아이씨테크 홈페이지 문의] ${payload.companyName} - ${
    payload.productModel || payload.inquiryTypeLabel
  }`;

  const reqsText =
    payload.selectedReqs.length > 0 ? payload.selectedReqs.join(", ") : "선택 없음";

  const text = [
    `[아이씨테크 홈페이지 견적·기술 상담 접수]`,
    ``,
    `문의 유형: ${payload.inquiryTypeLabel}`,
    `관심 모델: ${payload.productModel || "사양 추천 요청"}`,
    `예상 수량: ${payload.quantity}`,
    `요구 조건: ${reqsText}`,
    ``,
    `회사명/소속: ${payload.companyName}`,
    `담당자: ${payload.contactName}`,
    `연락처: ${payload.phone}`,
    `회신 이메일: ${payload.email}`,
    ``,
    `상세 문의 내용:`,
    payload.message || "(상세 내용 없음)",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; color: #ffffff; padding: 20px 24px;">
        <div style="font-size: 12px; color: #38bdf8; font-weight: 700; letter-spacing: 0.08em;">ICTECH QUOTE &amp; TECH SUPPORT</div>
        <h2 style="margin: 6px 0 0; font-size: 18px;">홈페이지 견적 · 기술 상담 문의 접수</h2>
      </div>
      <div style="padding: 24px; background: #ffffff; color: #1e293b; font-size: 14px; line-height: 1.6;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 18px;">
          <tbody>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; width: 130px; border: 1px solid #e2e8f0;">문의 유형</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.inquiryTypeLabel)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">관심 제품</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.productModel || "사양 추천 요청")}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">예상 수량</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.quantity)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">요구 조건</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(reqsText)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">회사명 / 소속</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.companyName)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">담당자</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.contactName)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">연락처</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(payload.phone)}</td></tr>
            <tr><td style="padding: 8px 12px; background: #f8fafc; font-weight: 700; border: 1px solid #e2e8f0;">이메일</td><td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td></tr>
          </tbody>
        </table>
        <div style="font-weight: 700; margin-bottom: 8px;">상세 문의 내용</div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; white-space: pre-wrap;">${escapeHtml(payload.message || "(상세 내용 없음)")}</div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function buildMailtoUrl(payload: ContactEmailPayload): string {
  const recipient = getRecipientEmail();
  const { subject, text } = buildEmailContent(payload);
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}

export async function sendContactEmail(
  payload: ContactEmailPayload
): Promise<SendMailResult> {
  const status = getMailConfigStatus();
  const recipient = status.recipient;
  const { subject, text, html } = buildEmailContent(payload);

  if (status.provider === "smtp") {
    const host = process.env.SMTP_HOST!.trim();
    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      process.env.SMTP_SECURE === "true" || port === 465;
    const user = process.env.SMTP_USER!.trim();
    const pass = process.env.SMTP_PASS!.trim();
    const from = process.env.SMTP_FROM?.trim() || `"아이씨테크 홈페이지" <${user}>`;

    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number.isFinite(port) ? port : 587,
        secure,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from,
        to: recipient,
        replyTo: payload.email,
        subject,
        text,
        html,
      });

      return { sent: true, configured: true, provider: "smtp", recipient };
    } catch (err) {
      return {
        sent: false,
        configured: true,
        provider: "smtp",
        recipient,
        error: err instanceof Error ? err.message : "SMTP 발송 중 오류가 발생했습니다.",
      };
    }
  }

  if (status.provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY!.trim();
    const from = process.env.SMTP_FROM?.trim() || "ICTech Contact <onboarding@resend.dev>";

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [recipient],
          reply_to: payload.email,
          subject,
          text,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        return {
          sent: false,
          configured: true,
          provider: "resend",
          recipient,
          error: `Resend API 오류 (${res.status}): ${body}`,
        };
      }

      return { sent: true, configured: true, provider: "resend", recipient };
    } catch (err) {
      return {
        sent: false,
        configured: true,
        provider: "resend",
        recipient,
        error: err instanceof Error ? err.message : "Resend API 호출 중 오류가 발생했습니다.",
      };
    }
  }

  return {
    sent: false,
    configured: false,
    provider: "none",
    recipient,
    error: "서버에 SMTP 또는 RESEND_API_KEY 환경변수가 설정되지 않았습니다.",
  };
}
