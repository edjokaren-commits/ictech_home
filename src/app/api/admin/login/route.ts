import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  SESSION_COOKIE_OPTIONS,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "관리자 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, SESSION_COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json(
      { error: "로그인 요청 처리 중 오류가 발생했습니다." },
      { status: 400 }
    );
  }
}
