"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const links = [
  { href: "/admin/documents", label: "Tài liệu" },
  { href: "/admin/staff", label: "Quản trị viên" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4 text-sm">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            pathname.startsWith(link.href) && "font-medium text-foreground"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
