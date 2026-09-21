import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, Car, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate, shouldShowUploadedDate } from "@/lib/dates";

const CATEGORY_STYLE: Record<
  string,
  { images: string[]; badge: string; border: string }
> = {
  "thong-bao": {
    images: ["/images/hero-fleet.jpg", "/images/gallery/khu-vuc-sat-hach.jpg"],
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-500",
  },
  "quyet-dinh": {
    images: ["/images/gallery/khu-vuc-sat-hach.jpg", "/images/gallery/khai-giang-tap-huan.jpg"],
    badge: "bg-amber-100 text-amber-700",
    border: "border-l-amber-500",
  },
  "quy-che-tuyen-sinh": {
    images: ["/images/gallery/khai-giang-tap-huan.jpg"],
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-l-emerald-500",
  },
  "quy-che-dao-tao": {
    images: ["/images/gallery/lop-hoc-bien-bao.jpg"],
    badge: "bg-purple-100 text-purple-700",
    border: "border-l-purple-500",
  },
  "van-ban-phap-ly": {
    images: ["/images/gallery/hoi-thi-giao-vien.jpg"],
    badge: "bg-teal-100 text-teal-700",
    border: "border-l-teal-500",
  },
  "thong-bao-trung-tam": {
    images: ["/images/gallery/le-20-11.jpg"],
    badge: "bg-rose-100 text-rose-700",
    border: "border-l-rose-500",
  },
};
const DEFAULT_STYLE = { images: ["/images/hero-fleet.jpg"], badge: "bg-primary/10 text-primary", border: "border-l-primary" };

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: "Đào tạo bài bản",
    desc: "Chương trình đào tạo lái xe theo đúng quy định, đội ngũ giáo viên giàu kinh nghiệm.",
  },
  {
    icon: ShieldCheck,
    title: "Học phí minh bạch",
    desc: "Mọi thông báo, quyết định điều chỉnh học phí đều được công khai đầy đủ trên website.",
  },
  {
    icon: Car,
    title: "Nhiều hạng đào tạo",
    desc: "Đào tạo đa dạng các hạng bằng lái xe cơ giới đường bộ.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: latestDocs } = await supabase
    .from("documents")
    .select(
      "id, title, document_number, signed_date, uploaded_date, document_categories(slug, label_vi)"
    )
    .eq("status", "published")
    .order("signed_date", { ascending: false })
    .limit(6);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero-fleet.jpg"
          alt="Đội xe sát hạch của Trung tâm đào tạo lái xe HAAN DLS"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--brand) 55%, transparent) 0%, color-mix(in oklch, var(--brand) 78%, transparent) 60%, color-mix(in oklch, var(--brand) 92%, transparent) 100%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-wide text-white sm:text-5xl">
            Trung tâm đào tạo lái xe HAAN DLS
          </h1>
          <p className="max-w-2xl text-lg text-white/85">
            Đồng hành cùng học viên trên hành trình lấy bằng lái xe an toàn, đúng quy định
            và minh bạch về học phí.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/khoa-hoc">Xem khóa học & học phí</Link>} />
            <Button
              size="lg"
              variant="outline"
              nativeButton={false}
              className="border-white/60 bg-white/5 text-white hover:bg-white/15 hover:text-white"
              render={<Link href="/van-ban">Thông báo & văn bản</Link>}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <Card key={item.title} className="border-transparent ring-1 ring-primary/10">
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-accent/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-wide">Tin tức & thông báo mới nhất</h2>
            <Link
              href="/van-ban"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
            >
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </div>

          {latestDocs && latestDocs.length > 0 ? (
            <div className="mt-8 flex flex-col gap-4">
              {latestDocs.map((doc, index) => {
                const category = Array.isArray(doc.document_categories)
                  ? doc.document_categories[0]
                  : doc.document_categories;
                const style = (category && CATEGORY_STYLE[category.slug]) || DEFAULT_STYLE;
                const image = style.images[index % style.images.length];
                return (
                  <Link key={doc.id} href={`/van-ban/${doc.id}`}>
                    <Card
                      className={`flex-row overflow-hidden border-l-4 p-0 transition-shadow hover:shadow-md ${style.border}`}
                    >
                      <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-64">
                        <Image
                          src={image}
                          alt={doc.title}
                          fill
                          sizes="(min-width: 640px) 256px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center gap-2 p-5">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base leading-snug">{doc.title}</CardTitle>
                          <FileText className="size-4 shrink-0 text-primary" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {category ? (
                            <Badge variant="secondary" className={`border-transparent ${style.badge}`}>
                              {category.label_vi}
                            </Badge>
                          ) : null}
                          <span>Ngày ký: {formatVNDate(doc.signed_date)}</span>
                          {shouldShowUploadedDate(doc.signed_date, doc.uploaded_date) && (
                            <span>· Đăng tải: {formatVNDate(doc.uploaded_date)}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">Chưa có thông báo nào được đăng.</p>
          )}

          <Link
            href="/van-ban"
            className="mt-8 flex items-center gap-1 text-sm font-medium text-primary hover:underline sm:hidden"
          >
            Xem tất cả <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
