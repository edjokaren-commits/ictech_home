import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const DATASHEET_DIR = path.join(UPLOAD_DIR, "datasheets");
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

      await fs.mkdir(DATASHEET_DIR, { recursive: true });
      const baseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 40);
      const filename = `${Date.now()}-${baseName || "datasheet"}${ext}`;
      const targetPath = path.join(DATASHEET_DIR, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(targetPath, buffer);

      return NextResponse.json({ url: `/uploads/datasheets/${filename}` }, { status: 201 });
    }

    if (!ALLOWED_IMAGE_EXT.has(ext)) {
      return NextResponse.json(
        { error: "PNG, JPG, WEBP, GIF 이미지만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const filename = `${Date.now()}-${baseName || "product"}${ext}`;
    const targetPath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(targetPath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "파일 업로드 중 오류가 발생했습니다.", detail: String(error) },
      { status: 500 }
    );
  }
}
