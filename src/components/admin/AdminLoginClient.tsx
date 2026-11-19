"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/products";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "비밀번호를 확인해 주세요.");
        return;
      }
      router.push(nextPath.startsWith("/admin") ? nextPath : "/admin/products");
      router.refresh();
    } catch {
      setError("로그인 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16 sm:py-24">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-lg sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
          <Lock className="h-6 w-6" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">관리자 로그인</h1>
        <p className="mt-2 text-sm text-slate-600">
          아이씨테크 제품 · 기술 블로그 · 문의 관리 페이지에 접근하려면 관리자 비밀번호를 입력해 주세요.
        </p>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700">
              관리자 비밀번호
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "인증 확인 중..." : "관리자 모드 로그인"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            세션 쿠키 보호 적용됨
          </span>
          <Link href="/" className="font-semibold text-slate-700 hover:text-blue-600">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
