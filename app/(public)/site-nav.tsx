"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOTLINE, STUDY_MATERIALS_URL } from "@/lib/site-info";

type NavItem = { href: string; label: string; external?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/#lich-thi", label: "Lịch thi" },
  { href: STUDY_MATERIALS_URL, label: "Ôn luyện", external: true },
  { href: "/#tin-tuc", label: "Tin tức" },
  { href: "/van-ban", label: "Văn bản" },
  { href: "/lien-he", label: "Liên hệ" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.external || item.href.includes("#")) return false;
  return item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
}

function NavLink({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-5 text-[15px] font-semibold whitespace-nowrap text-primary xl:flex">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className={cn(
            "border-b-2 border-transparent pb-1 transition-colors hover:text-primary/80",
            isActive(pathname, item) && "border-gold"
          )}
        />
      ))}
      <a
        href={HOTLINE.tel}
        className="flex h-11 items-center gap-2 rounded-lg bg-gold px-5 font-bold text-gold-foreground transition-opacity hover:opacity-90"
      >
        <Phone className="size-4" />
        {HOTLINE.display}
      </a>
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        className="flex size-11 items-center justify-center rounded-lg text-primary hover:bg-accent"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>
      {open ? (
        <nav className="absolute inset-x-0 top-full border-b bg-background px-4 pb-4 shadow-lg">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              onClick={() => setOpen(false)}
              className="flex h-12 items-center border-b text-[15px] font-semibold text-primary last:border-b-0"
            />
          ))}
        </nav>
      ) : null}
    </div>
  );
}
