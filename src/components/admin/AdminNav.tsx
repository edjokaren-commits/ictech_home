"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, BookOpen, Mail, LogOut } from "lucide-react";

type AdminTab = "products" | "blog" | "inquiries";

const TABS: { key: AdminTab; href: string; label: string; icon: typeof Package }[] = [
  { key: "products", href: "/admin/products", label: "제품 등록 · 관리", icon: Package },
  { key: "blog", href: "/admin/blog", label: "기술 블로그(BLOG) 관리", icon: BookOpen },
  { key: "inquiries", href: "/admin/inquiries", label: "문의 내역 · 메일 설정", icon: Mail },
];

export default function AdminNav({ active }: { active: AdminTab }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <nav className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-sky-400" : "text-slate-500"}`} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          로그아웃
        </button>
      </div>
    </div>
  );
}

