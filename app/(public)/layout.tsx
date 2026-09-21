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
      <div className="h-1 bg-primary" />
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-base font-semibold text-primary sm:text-lg"
          >
            <Image
              src="/logo.png"
              alt="Trung tâm giáo dục nghề nghiệp Hà An"
              width={36}
              height={36}
              className="shrink-0 rounded"
            />
            <span className="leading-tight">Trung tâm giáo dục nghề nghiệp Hà An</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-white/75">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center gap-2 font-heading text-lg font-semibold text-white">
                <Image
                  src="/logo.png"
                  alt="Trung tâm giáo dục nghề nghiệp Hà An"
                  width={28}
                  height={28}
                  className="shrink-0 rounded"
                />
                Trung tâm giáo dục nghề nghiệp Hà An
              </div>
              <p>Đào tạo lái xe uy tín, đúng quy định.</p>
            </div>
            <div>
              <div className="mb-2 font-medium text-white">Liên kết</div>
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 font-medium text-white">Liên hệ</div>
              <p>Thông tin liên hệ sẽ được cập nhật.</p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/15 pt-4 text-white/60">
            © {new Date().getFullYear()} Trung tâm giáo dục nghề nghiệp Hà An. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </>
  );
}
