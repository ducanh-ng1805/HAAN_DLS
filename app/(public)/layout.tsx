import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/khoa-hoc", label: "Khóa học" },
  { href: "/van-ban", label: "Văn bản" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="HAAN DLS" width={36} height={36} className="rounded" />
            <span>HAAN DLS</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                <Image src="/logo.png" alt="HAAN DLS" width={28} height={28} className="rounded" />
                HAAN DLS
              </div>
              <p>Trung tâm đào tạo lái xe HAAN DLS.</p>
            </div>
            <div>
              <div className="mb-2 font-medium text-foreground">Liên kết</div>
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 font-medium text-foreground">Liên hệ</div>
              <p>Thông tin liên hệ sẽ được cập nhật.</p>
            </div>
          </div>
          <div className="mt-8 border-t pt-4">
            © {new Date().getFullYear()} HAAN DLS. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </>
  );
}
