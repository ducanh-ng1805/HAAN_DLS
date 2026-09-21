"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

export function AdminNav({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/documents", label: "Tài liệu" },
    ...(isSuperAdmin ? [{ href: "/admin/staff", label: "Quản trị viên" }] : []),
  ];

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
