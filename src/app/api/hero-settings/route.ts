import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getHeroSettings, saveHeroSettings, type HeroSettings } from "@/lib/hero-store";

export async function GET() {
  const settings = await getHeroSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const total = Number(body.totalSlides);
    const totalSlides = total >= 3 && total <= 5 ? total : 3;

    const selectedProductSlugs = Array.isArray(body.selectedProductSlugs)
      ? body.selectedProductSlugs.filter((s: unknown) => typeof s === "string" && s.trim())
      : [];

    const updated = await saveHeroSettings({ totalSlides, selectedProductSlugs });

    revalidatePath("/");
    revalidatePath("/admin/products");

    return NextResponse.json({ ok: true, settings: updated });
  } catch (err) {
    return NextResponse.json(
      { error: "슬라이드 설정 저장 중 오류가 발생했습니다.", detail: String(err) },
      { status: 500 }
    );
  }
}
