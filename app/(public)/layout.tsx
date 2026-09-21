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
          <Link href="/" className="flex items-center gap-2 font-heading text-primary">
            <Image
              src="/logo.jpg"
              alt="Trung tâm đào tạo & sát hạch Hà An"
              width={36}
              height={36}
              className="shrink-0 rounded"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold sm:text-base">
                Trung tâm giáo dục nghề nghiệp Hà An
              </span>
              <span className="text-[11px] font-normal text-muted-foreground sm:text-xs">
                TRUNG TÂM ĐÀO TẠO & SÁT HẠCH HÀ AN
              </span>
            </span>
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
              <div className="mb-2 flex items-center gap-2 font-heading text-white">
                <Image
                  src="/logo-white.png"
                  alt="Trung tâm đào tạo & sát hạch Hà An"
                  width={99}
                  height={33}
                  className="shrink-0"
                />
                <span className="flex flex-col leading-tight">
                  <span className="text-base font-semibold sm:text-lg">
                    Trung tâm giáo dục nghề nghiệp Hà An
                  </span>
                  <span className="text-xs font-normal text-white/80 sm:text-sm">
                    TRUNG TÂM ĐÀO TẠO & SÁT HẠCH HÀ AN
                  </span>
                </span>
              </div>
              <p>TIÊN PHONG VỀ ĐÀO TẠO & SÁT HẠCH LÁI XE</p>
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
              <ul className="space-y-1">
                <li>Xóm Thiên Thai, Xã Toàn Lưu, Tỉnh Hà Tĩnh</li>
                <li>
                  Hotline:{" "}
                  <a href="tel:0971982689" className="transition-colors hover:text-white">
                    0971 982 689
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:ttgdnnhaan@haandls.com" className="transition-colors hover:text-white">
                    ttgdnnhaan@haandls.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/15 pt-4 text-white/60">
            © {new Date().getFullYear()} TRUNG TÂM ĐÀO TẠO & SÁT HẠCH HÀ AN. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>
    </>
  );
}
