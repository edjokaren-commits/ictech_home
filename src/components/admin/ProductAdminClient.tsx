"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  RotateCcw,
  FileJson,
  ExternalLink,
  Search,
  LogOut,
  SlidersHorizontal,
  Lock,
} from "lucide-react";
import {
  type HeroSettings,
  DEFAULT_HERO_SETTINGS,
  FIXED_FIRST_HERO_SLIDE,
} from "@/types/hero";
import {
  PRODUCT_FILTER_TAGS,
  type Product,
  type ProductCategory,
  type ProductSpecItem,
} from "@/data/products";

const VISUAL_TYPES: { value: Product["visualType"]; label: string }[] = [
  { value: "box-pc", label: "팬리스 박스 PC" },
  { value: "rackmount", label: "랙마운트 IPC (2U/4U)" },
  { value: "panel-pc", label: "산업용 패널 PC" },
  { value: "din-rail", label: "DIN-Rail 컨트롤러" },
  { value: "atx", label: "ATX 산업용 메인보드" },
  { value: "mini-itx", label: "Mini-ITX 메인보드" },
  { value: "sbc", label: "3.5\" / EPIC SBC" },
  { value: "pcie-card", label: "PICMG CPU 카드 / 확장 카드" },
];

const EMPTY_FORM = {
  slug: "",
  modelCode: "",
  name: "",
  category: "motherboard" as ProductCategory,
  visualType: "atx" as Product["visualType"],
  manufacturer: "IEI",
  externalUrl: "",
  imageUrl: "",
  datasheetUrl: "",
  tagline: "",
  summary: "",
  operatingTemp: "0°C ~ 60°C",
  supplyYears: "7년 장기 공급 보장",
  badgesText: "LGA1700, DDR5, Dual 2.5GbE",
  highlightsText: "",
  applicationsText: "",
  filterTags: ["장기공급"] as string[],
  specs: [
    { label: "폼팩터", value: "" },
    { label: "지원 CPU", value: "" },
    { label: "메모리", value: "" },
  ] as ProductSpecItem[],
};

export default function ProductAdminClient({
  initialProducts,
  initialHeroSettings,
}: {
  initialProducts: Product[];
  initialHeroSettings?: HeroSettings;
}) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(
    initialHeroSettings || DEFAULT_HERO_SETTINGS
  );
  const [showHeroConfig, setShowHeroConfig] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingDatasheet, setUploadingDatasheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      p.modelCode.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q)
    );
  });

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "이미지 업로드 실패");
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      showToast("제품 이미지가 업로드되었습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleDatasheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDatasheet(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", "datasheet");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "데이터시트 파일 업로드 실패");
        return;
      }
      setForm((prev) => ({ ...prev, datasheetUrl: data.url }));
      showToast("데이터시트 파일이 업로드되었습니다.");
    } finally {
      setUploadingDatasheet(false);
    }
  };

  const toggleFilterTag = (tag: string) => {
    if (tag === "전체") return;
    setForm((prev) => ({
      ...prev,
      filterTags: prev.filterTags.includes(tag)
        ? prev.filterTags.filter((t) => t !== tag)
        : [...prev.filterTags, tag],
    }));
  };

  const handleSpecChange = (idx: number, field: "label" | "value", val: string) => {
    setForm((prev) => {
      const next = [...prev.specs];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, specs: next };
    });
  };

  const addSpecRow = () => {
    setForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "", value: "" }],
    }));
  };

  const removeSpecRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

  const startEdit = (product: Product) => {
    setEditingSlug(product.slug);
    setForm({
      slug: product.slug,
      modelCode: product.modelCode,
      name: product.name,
      category: product.category,
      visualType: product.visualType,
      manufacturer: product.manufacturer || "IEI",
      externalUrl: product.externalUrl || "",
      imageUrl: product.imageUrl || "",
      datasheetUrl: product.datasheetUrl || "",
      tagline: product.tagline,
      summary: product.summary,
      operatingTemp: product.operatingTemp,
      supplyYears: product.supplyYears,
      badgesText: product.badges.join(", "),
      highlightsText: product.highlights.join("\n"),
      applicationsText: product.applications.join(", "),
      filterTags: product.filterTags,
      specs: product.specs.length > 0 ? product.specs : [{ label: "", value: "" }],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingSlug(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.modelCode.trim() || !form.name.trim()) {
      showToast("모델 코드와 제품명을 입력해 주세요.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        slug: editingSlug || form.slug || form.modelCode,
        modelCode: form.modelCode.trim(),
        name: form.name.trim(),
        category: form.category,
        visualType: form.visualType,
        manufacturer: form.manufacturer.trim(),
        externalUrl: form.externalUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        datasheetUrl: form.datasheetUrl.trim(),
        tagline: form.tagline.trim(),
        summary: form.summary.trim(),
        operatingTemp: form.operatingTemp.trim(),
        supplyYears: form.supplyYears.trim(),
        badges: form.badgesText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        highlights: form.highlightsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        applications: form.applicationsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        filterTags: form.filterTags,
        specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "저장 중 오류가 발생했습니다.");
        return;
      }

      setProducts(data.products);
      showToast(
        editingSlug
          ? `'${payload.modelCode}' 제품 정보가 수정되었습니다.`
          : `'${payload.modelCode}' 제품이 카탈로그에 등록(설치)되었습니다.`
      );
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, modelCode: string) => {
    if (!window.confirm(`'${modelCode}' 제품을 삭제하시겠습니까?`)) return;
    const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      setProducts(data.products);
      if (editingSlug === slug) resetForm();
      showToast(`'${modelCode}' 제품이 삭제되었습니다.`);
      router.refresh();
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: list }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        setJsonInput("");
        setShowJsonImport(false);
        showToast(`${data.imported}개 제품이 일괄 설치되었습니다.`);
        router.refresh();
      } else {
        showToast(data.error || "일괄 설치 실패");
      }
    } catch {
      showToast("유효한 JSON 형식이 아닙니다.");
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "기본 23개 IEI/ICTech 제품 카탈로그로 초기화하시겠습니까? 추가/수정된 내역이 초기화됩니다."
      )
    )
      return;
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    const data = await res.json();
    if (res.ok) {
      setProducts(data.products);
      resetForm();
      showToast("기본 제품 카탈로그로 복원되었습니다.");
      router.refresh();
    }
  };

  const handleSaveHeroSettings = async () => {
    setSavingHero(true);
    try {
      const res = await fetch("/api/hero-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroSettings),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "슬라이드 설정 저장 실패");
        return;
      }
      setHeroSettings(data.settings);
      showToast("메인 배너 슬라이드 설정이 저장되었습니다. (홈페이지에 즉시 반영)");
      router.refresh();
    } catch {
      showToast("슬라이드 설정 저장 중 오류가 발생했습니다.");
    } finally {
      setSavingHero(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {statusMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {statusMessage}
        </div>
      )}

      {/* Top Actions Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          현재 등록된 제품: <strong className="text-slate-900">{products.length}개</strong>{" "}
          (등록 즉시 <Link href="/products" className="font-semibold text-blue-600 underline">/products 카탈로그</Link>에 반영됩니다)
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowHeroConfig((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100"
          >
            <SlidersHorizontal className="h-4 w-4 text-sky-600" />
            메인 슬라이드 배너 설정 ({heroSettings.totalSlides}개)
          </button>
          <button
            type="button"
            onClick={() => setShowJsonImport((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileJson className="h-4 w-4 text-blue-600" />
            JSON 일괄 등록
          </button>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" />
            기본 카탈로그 복원
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>

      {/* Hero Slide Config Drawer */}
      {showHeroConfig && (
        <div className="mb-8 rounded-2xl border border-sky-200 bg-sky-50/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/80 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                메인 페이지 히어로 슬라이드 배너 설정
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                1번 고정 슬라이드(전체 제품 라인업)와 함께 노출할 슬라이드 총 개수 및 2번 이후의 대표 제품을 직접 선정합니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={savingHero}
                onClick={handleSaveHeroSettings}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {savingHero ? "저장 중..." : "슬라이드 설정 저장"}
              </button>
              <button
                type="button"
                onClick={() => setShowHeroConfig(false)}
                className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {/* 1. Slide Count Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800">
                메인 슬라이드 총 개수 선택
              </label>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {[3, 4, 5].map((count) => {
                  const active = heroSettings.totalSlides === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() =>
                        setHeroSettings((prev) => ({ ...prev, totalSlides: count }))
                      }
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                          : "border-slate-300 bg-white text-slate-700 hover:border-blue-300"
                      }`}
                    >
                      <span>총 {count}개 슬라이드</span>
                      <span
                        className={`text-[10px] font-normal ${
                          active ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        (고정 1 + 제품 {count - 1}개)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slide 1 (Fixed) Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  1번 슬라이드: 전체 제품 라인업 보기 (고정 · 수정 불가)
                </span>
                <span className="text-[11px] text-slate-400">
                  배경: /images/ict_main_bg.png · 링크: /products
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">
                  {FIXED_FIRST_HERO_SLIDE.title}
                </p>
                <p className="mt-0.5 text-slate-500">
                  {FIXED_FIRST_HERO_SLIDE.subtitle}
                </p>
              </div>
            </div>

            {/* 3. Product Slots Selection (Slide 2 .. N) */}
            <div>
              <label className="block text-xs font-bold text-slate-800">
                2번 이후 슬라이드 대표 제품 선정 ({heroSettings.totalSlides - 1}개 필요)
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                각 슬라이드 번호에 노출할 제품을 드롭다운에서 선택하세요. (IMBA-R680과 동일한 좌측 스펙/버튼 + 우측 4:3 카드 레이아웃으로 자동 렌더링됩니다.)
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: heroSettings.totalSlides - 1 }).map((_, slotIdx) => {
                  const slideNumber = slotIdx + 2;
                  const currentSlug = heroSettings.selectedProductSlugs[slotIdx] || "";
                  const matchedProduct = products.find((p) => p.slug === currentSlug);

                  return (
                    <div
                      key={slotIdx}
                      className="rounded-xl border border-sky-200 bg-white p-3.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {slideNumber}번 슬라이드
                        </span>
                        {matchedProduct && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {matchedProduct.modelCode}
                          </span>
                        )}
                      </div>

                      <select
                        value={currentSlug}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeroSettings((prev) => {
                            const nextList = [...prev.selectedProductSlugs];
                            nextList[slotIdx] = val;
                            return { ...prev, selectedProductSlugs: nextList };
                          });
                        }}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">-- 대표 제품 선택 --</option>
                        {products.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.modelCode} ({p.name})
                          </option>
                        ))}
                      </select>

                      {matchedProduct && (
                        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                          {matchedProduct.imageUrl ? (
                            <img
                              src={matchedProduct.imageUrl}
                              alt={matchedProduct.modelCode}
                              className="h-9 w-9 shrink-0 rounded object-contain bg-white border border-slate-200"
                            />
                          ) : (
                            <div className="h-9 w-9 shrink-0 rounded bg-slate-200" />
                          )}
                          <div className="min-w-0 text-[11px]">
                            <div className="truncate font-semibold text-slate-800">
                              {matchedProduct.name}
                            </div>
                            <div className="truncate text-slate-500 text-[10px]">
                              링크: /products/{matchedProduct.slug}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk JSON Import Drawer */}
      {showJsonImport && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50/50 p-6">
          <h2 className="text-base font-bold text-slate-900">
            JSON 데이터로 여러 제품 일괄 설치 (Bulk Import)
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            아래 형식의 JSON 배열 또는 객체를 붙여넣고 &apos;일괄 설치 실행&apos;을 누르세요.
          </p>
          <textarea
            rows={6}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`[\n  {\n    "modelCode": "IMBA-Q670-ECO",\n    "name": "ATX 산업용 보드",\n    "category": "motherboard",\n    "tagline": "Intel 14th Gen Core ATX Motherboard",\n    "externalUrl": "https://www.ieiworld.com/kr/product/IMBA-R680.php"\n  }\n]`}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleBulkImport}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              일괄 설치 실행
            </button>
            <button
              type="button"
              onClick={() => setShowJsonImport(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Add / Edit Product Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {editingSlug ? `제품 수정: ${form.modelCode}` : "신규 제품 등록 · 설치"}
            </h2>
            {editingSlug && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                + 새 제품 등록 모드로 전환
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                모델 코드 * (예: IMBA-R680)
              </label>
              <input
                type="text"
                required
                value={form.modelCode}
                onChange={(e) => setForm({ ...form, modelCode: e.target.value })}
                placeholder="IMBA-R680"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                제품명 * (예: LGA1700 ATX 산업용 메인보드)
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="LGA1700 ATX 산업용 메인보드"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">카테고리</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as ProductCategory })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="ipc">산업용 컴퓨터</option>
                <option value="motherboard">산업용 메인보드</option>
                <option value="module">케이스 및 기타</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">기본 도면 형태</label>
              <select
                value={form.visualType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visualType: e.target.value as Product["visualType"],
                  })
                }
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {VISUAL_TYPES.map((vt) => (
                  <option key={vt.value} value={vt.value}>
                    {vt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">제조사</label>
              <input
                type="text"
                value={form.manufacturer}
                onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                placeholder="IEI / ICTech"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          {/* Image Upload or URL + Reference URL */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                제품 이미지 (직접 업로드 또는 URL)
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/uploads/... 또는 이미지 URL"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "중..." : "파일"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">
                제조사 참조 URL (IEI 링크 등)
              </label>
              <input
                type="url"
                value={form.externalUrl}
                onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                placeholder="https://www.ieiworld.com/kr/product/..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">
                제품 데이터시트 (링크 주소 입력 또는 PDF/문서 파일 직접 첨부)
              </label>
              <div className="mt-1.5 flex gap-2">
                <input
                  type="text"
                  value={form.datasheetUrl}
                  onChange={(e) => setForm({ ...form, datasheetUrl: e.target.value })}
                  placeholder="https://... (외부 링크) 또는 우측 파일 버튼으로 PDF/문서 첨부"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
                <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingDatasheet ? "업로드 중..." : "파일 첨부"}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,image/*"
                    onChange={handleDatasheetUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {form.datasheetUrl && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate font-mono">등록된 경로: {form.datasheetUrl}</span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, datasheetUrl: "" }))}
                    className="ml-2 shrink-0 font-semibold text-red-600 hover:underline"
                  >
                    첨부 삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              핵심 요약 / 영문 원문 스펙 라인
            </label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="ATX motherboard supports LGA1700 Intel® 12/13/14th Gen..."
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">상세 설명</label>
            <textarea
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="제품의 산업 현장 장점과 지원 인터페이스를 입력하세요."
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">동작 온도</label>
              <input
                type="text"
                value={form.operatingTemp}
                onChange={(e) => setForm({ ...form, operatingTemp: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">공급 수명 주기</label>
              <input
                type="text"
                value={form.supplyYears}
                onChange={(e) => setForm({ ...form, supplyYears: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">
              배지 태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={form.badgesText}
              onChange={(e) => setForm({ ...form, badgesText: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700">카탈로그 스펙 필터 태그</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRODUCT_FILTER_TAGS.filter((t) => t !== "전체").map((tag) => {
                const active = form.filterTags.includes(tag);
                const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleFilterTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      active
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Specs Table Builder */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">상세 하드웨어 스펙 테이블</span>
              <button
                type="button"
                onClick={addSpecRow}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> 스펙 행 추가
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {form.specs.map((row, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                    placeholder="항목 (예: 칩셋)"
                    className="w-1/3 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                    placeholder="사양 내용 (예: Intel R680E)"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="rounded-lg border border-slate-200 px-2 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                주요 특장점 (줄바꿈으로 구분)
              </label>
              <textarea
                rows={3}
                value={form.highlightsText}
                onChange={(e) => setForm({ ...form, highlightsText: e.target.value })}
                placeholder={"ECC DDR5 지원\nDual 2.5GbE LAN"}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700">
                적용 분야 (쉼표로 구분)
              </label>
              <textarea
                rows={3}
                value={form.applicationsText}
                onChange={(e) => setForm({ ...form, applicationsText: e.target.value })}
                placeholder="반도체 검사, 머신비전, 스마트팩토리"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {saving
              ? "저장 중..."
              : editingSlug
              ? "제품 수정 내용 저장"
              : "카탈로그에 제품 등록(설치)하기"}
          </button>
        </form>

        {/* Right: Installed Products Manager */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">설치된 제품 목록</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700">
              {products.length}
            </span>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="등록된 모델 검색..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs"
            />
          </div>

          <div className="mt-4 max-h-[720px] space-y-2.5 overflow-y-auto pr-1">
            {filtered.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {item.modelCode}
                    </span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {item.name}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/products/${item.slug}`}
                    title="제품 페이지 보기"
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    title="수정"
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="삭제"
                    onClick={() => handleDelete(item.slug, item.modelCode)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

