import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ShieldCheck, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate, shouldShowUploadedDate } from "@/lib/dates";

const CATEGORY_STYLE: Record<string, { badge: string }> = {
  "thong-bao": { badge: "bg-blue-100 text-blue-700" },
  "quyet-dinh": { badge: "bg-amber-100 text-amber-700" },
  "quy-che-tuyen-sinh": { badge: "bg-emerald-100 text-emerald-700" },
  "quy-che-dao-tao": { badge: "bg-purple-100 text-purple-700" },
  "van-ban-phap-ly": { badge: "bg-teal-100 text-teal-700" },
  "thong-bao-trung-tam": { badge: "bg-rose-100 text-rose-700" },
};
const DEFAULT_STYLE = { badge: "bg-primary/10 text-primary" };

// Pool of real center photos to illustrate news items. Picked per title
// keyword where possible, then de-duplicated against the pool so no two
// items in the same list ever show the same photo.
const NEWS_IMAGE_POOL = [
  "/images/gallery/khu-vuc-sat-hach.jpg",
  "/images/hero-fleet.jpg",
  "/images/gallery/khai-giang-tap-huan.jpg",
  "/images/gallery/lop-hoc-bien-bao.jpg",
  "/images/gallery/hoi-thi-giao-vien.jpg",
  "/images/gallery/le-20-11.jpg",
  "/images/gallery/ngay-8-3.jpg",
  "/images/gallery/giai-bong-da.jpg",
];

function preferredImageForTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("sát hạch") || t.includes("kiểm tra") || t.includes("thi")) {
    return "/images/gallery/khu-vuc-sat-hach.jpg";
  }
  if (t.includes("khai giảng") || t.includes("tuyển sinh")) {
    return "/images/gallery/khai-giang-tap-huan.jpg";
  }
  if (t.includes("giáo viên") || t.includes("giảng viên")) {
    return "/images/gallery/hoi-thi-giao-vien.jpg";
  }
  if (t.includes("đào tạo") || t.includes("khóa") || t.includes("chương trình")) {
    return "/images/gallery/lop-hoc-bien-bao.jpg";
  }
  return "/images/hero-fleet.jpg";
}

function assignUniqueNewsImages(titles: string[]): string[] {
  const used = new Set<string>();
  return titles.map((title) => {
    let image = preferredImageForTitle(title);
    if (used.has(image)) {
      image = NEWS_IMAGE_POOL.find((candidate) => !used.has(candidate)) ?? image;
    }
    used.add(image);
    return image;
  });
}

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
          alt="Đội xe sát hạch của Trung tâm giáo dục nghề nghiệp Hà An"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0) 100%), linear-gradient(0deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:py-32">
          <h1 className="text-4xl font-bold tracking-wide text-white sm:text-5xl">
            Trung tâm giáo dục nghề nghiệp Hà An
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
            <div className="mt-8 flex flex-col gap-6">
              {assignUniqueNewsImages(latestDocs.map((d) => d.title)).map((image, index) => {
                const doc = latestDocs[index];
                const category = Array.isArray(doc.document_categories)
                  ? doc.document_categories[0]
                  : doc.document_categories;
                const style = (category && CATEGORY_STYLE[category.slug]) || DEFAULT_STYLE;
                return (
                  <Link key={doc.id} href={`/van-ban/${doc.id}`}>
                    <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                      <div className="relative aspect-[21/6] w-full">
                        <Image
                          src={image}
                          alt={doc.title}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        {category ? (
                          <Badge
                            variant="secondary"
                            className={`absolute top-3 left-3 border-transparent ${style.badge}`}
                          >
                            {category.label_vi}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2 p-5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Ngày ký: {formatVNDate(doc.signed_date)}</span>
                          {shouldShowUploadedDate(doc.signed_date, doc.uploaded_date) && (
                            <span>· Đăng tải: {formatVNDate(doc.uploaded_date)}</span>
                          )}
                        </div>
                        <CardTitle className="text-base leading-snug">{doc.title}</CardTitle>
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
