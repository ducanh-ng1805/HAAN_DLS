import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { HOTLINE, ZALO_URL } from "@/lib/site-info";
import { DesktopNav, MobileNav } from "./site-nav";

const CENTER_NAME = "Trung tâm giáo dục nghề nghiệp Hà An";
const ADDRESS = "Xóm Thiên Thai, xã Toàn Lưu, tỉnh Hà Tĩnh";
const EMAIL = "ttgdnnhaan@haandls.com";
const LICENSE = "Giấy phép đào tạo lái xe ô tô số 1333/SGTVT-QLPT&NL";

const FOOTER_LINKS = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/khoa-hoc", label: "Khóa học & học phí" },
  { href: "/van-ban", label: "Văn bản" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden bg-brand-deep text-[13px] text-white/75 sm:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-7 px-4 lg:px-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {ADDRESS}
          </span>
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-white">
            <Mail className="size-3.5" />
            {EMAIL}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="relative mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 lg:h-22 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <Image
              src="/logo.jpg"
              alt={CENTER_NAME}
              width={52}
              height={52}
              className="size-11 shrink-0 rounded-lg lg:size-13"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold uppercase sm:text-base xl:text-[17px]">
                {CENTER_NAME}
              </span>
              <span className="text-xs text-muted-foreground sm:text-[13px]">
                Tiên phong về đào tạo & sát hạch lái xe
              </span>
            </span>
          </Link>
          <DesktopNav />
          <MobileNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-primary pb-16 text-white/75 sm:pb-0">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3.5 text-sm leading-relaxed">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-white.png"
                  alt={CENTER_NAME}
                  width={44}
                  height={44}
                  className="shrink-0 rounded"
                />
                <span className="text-base font-extrabold text-white uppercase">{CENTER_NAME}</span>
              </div>
              <span>Tiên phong về đào tạo & sát hạch lái xe</span>
              <span>{LICENSE}</span>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <span className="text-[15px] font-bold text-white">Liên kết</span>
              {FOOTER_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              <span className="text-[15px] font-bold text-white">Liên hệ</span>
              <span>{ADDRESS}</span>
              <span>
                Hotline:{" "}
                <a href={HOTLINE.tel} className="hover:text-white">
                  {HOTLINE.display}
                </a>
              </span>
              <span>
                Email:{" "}
                <a href={`mailto:${EMAIL}`} className="hover:text-white">
                  {EMAIL}
                </a>
              </span>
            </div>

            <iframe
              title={`Bản đồ ${CENTER_NAME}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-44 w-full rounded-xl border-0"
            />
          </div>

          <div className="mt-12 border-t border-white/15 pt-6 text-[13px] text-white/60">
            © {new Date().getFullYear()} {CENTER_NAME}. Bảo lưu mọi quyền.
          </div>
        </div>
      </footer>

      {/* Sticky call bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t bg-background p-2 sm:hidden">
        <a
          href={HOTLINE.tel}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-gold font-bold text-gold-foreground"
        >
          <Phone className="size-4" />
          Gọi ngay
        </a>
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center rounded-lg border-2 border-primary font-bold text-primary"
        >
          Nhắn Zalo
        </a>
      </div>
    </>
  );
}
