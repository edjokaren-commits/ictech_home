import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const ALLOWED_DATASHEET_EXT = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".zip",
  ".png",
  ".jpg",
  ".jpeg",
]);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase 환경 변수(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "업로드할 파일이 없습니다." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();

    if (kind === "datasheet") {
      if (!ALLOWED_DATASHEET_EXT.has(ext)) {
        return NextResponse.json(
          { error: "PDF, Office(DOC/XLS/PPT), TXT, ZIP, 이미지 파일만 업로드할 수 있습니다." },
          { status: 400 }
        );
      }

      const baseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 40);
      const storagePath = `datasheets/${Date.now()}-${baseName || "datasheet"}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("uploads").getPublicUrl(storagePath);
      return NextResponse.json({ url: data.publicUrl }, { status: 201 });
    }

    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      return NextResponse.json(
        { error: "PNG, JPG, WEBP, GIF 이미지만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const storagePath = `images/${Date.now()}-${baseName || "product"}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("uploads").getPublicUrl(storagePath);
    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "파일 업로드 중 오류가 발생했습니다.", detail: String(error) },
      { status: 500 }
    );
  }
}