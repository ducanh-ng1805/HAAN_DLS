import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Phone, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate } from "@/lib/dates";
import { HOTLINE, STUDY_MATERIALS_URL, ZALO_URL } from "@/lib/site-info";

// Current month's exam schedule, as published by the Phòng Đào tạo.
// Replace the image (and title) each month.
const EXAM_SCHEDULE = {
  src: "/images/lich-thi/lich-thi-10-2026.png",
  width: 878,
  height: 700,
  title: "Lịch thi kết thúc khóa học và sát hạch tháng 10/2026",
};

const CATEGORY_STYLE: Record<string, { badge: string }> = {
  "lich-thi": { badge: "bg-red-100 text-red-700" },
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

// Fees from QĐ số 76/QĐ-HAAN, applied from 22/08/2026 (VAT 8% included).
// Training hours from the Trung tâm's detailed programme under Thông tư 17/2026/TT-BXD
// (QĐ 110/QĐ-GDNNHA); age requirement from the Quy chế tuyển sinh (QĐ 01/QĐ-GDNNHA).
const FEE_DECISION = "QĐ số 76/QĐ-HAAN, áp dụng từ 22/08/2026";
const COURSES = [
  {
    code: "B",
    name: "Hạng B số tự động",
    note: "Bao gồm cả ô tô điện",
    hours: "196 giờ (lý thuyết 136 · thực hành 60)",
    km: "950 km",
    fee: "19.500.000",
  },
  {
    code: "B",
    name: "Hạng B số sàn",
    note: "Xe số cơ khí",
    hours: "228 giờ (lý thuyết 152 · thực hành 76)",
    km: "1.050 km",
    fee: "20.000.000",
  },
  {
    code: "C1",
    name: "Hạng C1",
    note: "Ô tô tải hạng C1",
    hours: "237 giờ (lý thuyết 152 · thực hành 85)",
    km: "1.050 km",
    fee: "25.000.000",
  },
];

const STEPS = [
  {
    title: "Đăng ký hồ sơ",
    desc: "Đăng ký trực tiếp tại Trung tâm hoặc online qua email, Zalo; nộp hồ sơ và ký hợp đồng đào tạo.",
  },
  {
    title: "Học lý thuyết",
    desc: "Học tập trung tại Trung tâm hoặc tự học các môn lý thuyết theo quy định.",
  },
  {
    title: "Học thực hành",
    desc: "Học tập trung tại Trung tâm: cabin điện tử, sân tập và đường giao thông (DAT).",
  },
  {
    title: "Kiểm tra & sát hạch",
    desc: "Kiểm tra kết thúc khóa học, sau đó dự sát hạch cấp giấy phép lái xe.",
  },
];

// Answers drawn from the Quy chế tuyển sinh (Điều 5, 6, 9), the TT17 detailed
// programme and QĐ 76 on tuition.
const FAQS = [
  {
    q: "Ai được đăng ký học lái xe?",
    a: "Công dân Việt Nam, người nước ngoài được phép cư trú hoặc đang làm việc, học tập tại Việt Nam. Người học hạng B và C1 phải đủ 18 tuổi (tính đến ngày dự sát hạch) và đủ sức khỏe theo quy định.",
  },
  {
    q: "Hồ sơ đăng ký học lái xe gồm những gì?",
    a: [
      "Đơn đề nghị học, sát hạch để cấp giấy phép lái xe",
      "Giấy khám sức khỏe của người lái xe do cơ sở y tế có thẩm quyền cấp",
      "Bản sao giấy phép lái xe các hạng (nếu có)",
      "Bản cam kết về tính đầy đủ, chính xác, hợp pháp của hồ sơ",
      "Vỏ đựng hồ sơ theo mẫu của Trung tâm",
      "Khi nộp hồ sơ, xuất trình thẻ căn cước công dân hoặc căn cước điện tử trên VNeID; người học được chụp ảnh trực tiếp tại Trung tâm",
    ],
  },
  {
    q: "Một khóa học kéo dài bao lâu?",
    a: "Mỗi khóa học không quá 90 ngày. Tổng thời gian đào tạo: hạng B số tự động 196 giờ, hạng B số sàn 228 giờ, hạng C1 237 giờ (gồm lý thuyết và thực hành).",
  },
  {
    q: "Học phí được đóng như thế nào?",
    a: "Người học đóng đủ học phí trước khi lên lớp. Học phí được niêm yết công khai và ổn định suốt khóa học, Trung tâm xuất hóa đơn GTGT theo mức niêm yết. Học phí chưa gồm lệ phí sát hạch, cấp bằng.",
  },
];

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-bold tracking-[0.12em] text-[#9a6a1e]">{eyebrow}</span>
      <h2 className="font-sans text-3xl font-extrabold tracking-normal text-primary sm:text-[38px]">{title}</h2>
    </div>
  );
}

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-1 text-[15px] font-bold text-primary hover:underline">
      {children} <ArrowRight className="size-4" />
    </Link>
  );
}

function categoryOf<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: examCategory } = await supabase
    .from("document_categories")
    .select("id")
    .eq("slug", "lich-thi")
    .maybeSingle();

  const docFields =
    "id, title, document_number, signed_date, uploaded_date, featured, document_categories(slug, label_vi)";

  const newsQuery = supabase
    .from("documents")
    .select(docFields)
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("signed_date", { ascending: false })
    .limit(3);

  let latestQuery = supabase
    .from("documents")
    .select(docFields)
    .eq("status", "published")
    .order("signed_date", { ascending: false })
    .limit(6);
  if (examCategory) latestQuery = latestQuery.neq("category_id", examCategory.id);

  const [{ data: news }, { data: latestDocs }] = await Promise.all([newsQuery, latestQuery]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white">
        <h1 className="sr-only">Trung tâm giáo dục nghề nghiệp Hà An</h1>
        {/* The cover banner carries its own slogan, so the headline sits below it rather than on top. */}
        <div className="relative aspect-[2027/776] w-full">
          <Image
            src="/images/hero-cover.jpg"
            alt="Trung tâm giáo dục nghề nghiệp Hà An - Tiên phong về đào tạo & sát hạch lái xe"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:px-8">
          <div className="flex flex-col gap-6">
            <p className="max-w-4xl font-sans text-3xl leading-tight font-extrabold sm:text-4xl lg:text-5xl">
              Học lái xe ô tô hạng B, C1 tại Hà Tĩnh — đào tạo và sát hạch cùng một nơi
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-white/75 sm:text-[19px]">
              Chương trình đào tạo đúng quy định, giáo viên giàu kinh nghiệm, học phí công khai đầy đủ trên website.
            </p>
            <div className="mt-2 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href="/khoa-hoc"
                className="flex h-13 items-center justify-center rounded-lg bg-gold px-7 font-bold text-gold-foreground transition-opacity hover:opacity-90"
              >
                Xem khóa học & học phí
              </Link>
              <Link
                href="/van-ban"
                className="flex h-13 items-center justify-center rounded-lg border-[1.5px] border-white/50 px-7 font-semibold transition-colors hover:bg-white/10"
              >
                Thông báo & văn bản
              </Link>
            </div>
          </div>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl ring-1 ring-white/15">
            <Image
              src="/images/san-sat-hach.jpg"
              alt="Đội xe sát hạch trước khu nhà điều hành của Trung tâm giáo dục nghề nghiệp Hà An"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-[center_85%]"
            />
          </div>
        </div>
      </section>

      {/* Hạng đào tạo */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="KHÓA HỌC" title="Các hạng đang đào tạo" />
            <MoreLink href="/khoa-hoc">Xem chi tiết học phí</MoreLink>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {COURSES.map((course, i) => (
              <div key={course.name} className="flex flex-col gap-5 rounded-2xl border bg-background p-7 lg:p-9">
                <div className="flex items-center gap-4">
                  <span
                    className={
                      i === COURSES.length - 1
                        ? "flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-[28px] font-extrabold text-gold-foreground"
                        : "flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-3xl font-extrabold text-white"
                    }
                  >
                    {course.code}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[22px] font-extrabold text-primary">{course.name}</span>
                    <span className="text-[15px] text-muted-foreground">{course.note}</span>
                  </div>
                </div>
                <dl className="flex flex-col gap-2 text-[15px]">
                  <div>
                    <dt className="inline text-muted-foreground">Thời gian đào tạo: </dt>
                    <dd className="inline">{course.hours}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Thực hành lái xe: </dt>
                    <dd className="inline">{course.km}</dd>
                  </div>
                  <div>
                    <dt className="inline text-muted-foreground">Độ tuổi: </dt>
                    <dd className="inline">đủ 18 tuổi</dd>
                  </div>
                </dl>
                <div className="mt-auto flex flex-col gap-1">
                  <span className="text-2xl font-extrabold text-primary">{course.fee}đ</span>
                  <span className="text-[13px] text-muted-foreground">
                    Đã gồm VAT 8% · theo {FEE_DECISION}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 lg:px-8 lg:py-24">
          <SectionHeading eyebrow="QUY TRÌNH" title="Từ đăng ký đến nhận giấy phép lái xe" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className={`flex flex-col gap-3 border-t-[3px] pt-5 ${i === STEPS.length - 1 ? "border-gold" : "border-primary"}`}
              >
                <span className="text-sm font-extrabold text-[#9a6a1e]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[19px] font-bold text-primary">{step.title}</span>
                <span className="text-[15px] leading-relaxed text-muted-foreground">{step.desc}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lịch thi */}
      <section id="lich-thi" className="scroll-mt-24 bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="LỊCH THI" title="Lịch thi tốt nghiệp & sát hạch" />
            <MoreLink href="/van-ban?category=lich-thi">Xem lịch các tháng trước</MoreLink>
          </div>
          <a
            href={EXAM_SCHEDULE.src}
            target="_blank"
            rel="noopener noreferrer"
            className="block self-center overflow-hidden rounded-2xl border bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:p-4"
          >
            <Image
              src={EXAM_SCHEDULE.src}
              alt={EXAM_SCHEDULE.title}
              width={EXAM_SCHEDULE.width}
              height={EXAM_SCHEDULE.height}
              sizes="(min-width: 920px) 878px, 100vw"
              className="h-auto w-full max-w-[878px]"
            />
          </a>
          <p className="text-center text-sm text-muted-foreground">
            {EXAM_SCHEDULE.title} — bấm vào ảnh để xem kích thước đầy đủ.
          </p>
        </div>
      </section>

      {/* Ôn luyện */}
      <section className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold">
              <BookOpen className="size-7" />
            </span>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold tracking-[0.12em] text-[#f3d7a6]">ÔN LUYỆN</span>
              <span className="text-2xl font-extrabold sm:text-3xl">Tài liệu ôn luyện lý thuyết</span>
              <span className="text-base text-white/75">
                Ôn tập trước kỳ kiểm tra kết thúc khóa học và sát hạch.
              </span>
            </div>
          </div>
          <a
            href={STUDY_MATERIALS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-13 shrink-0 items-center justify-center gap-2 rounded-lg bg-gold px-7 font-bold text-gold-foreground transition-opacity hover:opacity-90"
          >
            Mở tài liệu ôn luyện <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Tin tức */}
      <section id="tin-tuc" className="scroll-mt-24 bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="TIN TỨC" title="Tin tức & hoạt động" />
            <MoreLink href="/van-ban">Xem tất cả tin tức</MoreLink>
          </div>
          {news && news.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-3">
              {assignUniqueNewsImages(news.map((d) => d.title)).map((image, index) => {
                const doc = news[index];
                const category = categoryOf(doc.document_categories);
                const style = (category && CATEGORY_STYLE[category.slug]) || DEFAULT_STYLE;
                return (
                  <Link key={doc.id} href={`/van-ban/${doc.id}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                      <Image
                        src={image}
                        alt={doc.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {doc.featured ? (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 right-3 gap-1 border-transparent bg-amber-400 text-amber-950"
                        >
                          <Star className="size-3 fill-current" />
                          Nổi bật
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#9a6a1e]">
                      {category ? (
                        <Badge variant="secondary" className={`border-transparent ${style.badge}`}>
                          {category.label_vi}
                        </Badge>
                      ) : null}
                      <span>{formatVNDate(doc.signed_date)}</span>
                    </div>
                    <span className="text-xl leading-snug font-bold text-primary group-hover:underline">
                      {doc.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có tin tức nào được đăng.</p>
          )}
        </div>
      </section>

      {/* Văn bản */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="CÔNG KHAI" title="Thông báo & văn bản mới nhất" />
            <MoreLink href="/van-ban">Xem tất cả văn bản</MoreLink>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-background">
            <div className="hidden grid-cols-[150px_minmax(0,1fr)_130px_130px] gap-6 bg-accent px-7 py-4 text-[13px] font-bold tracking-wide text-muted-foreground md:grid">
              <span>LOẠI</span>
              <span>TRÍCH YẾU</span>
              <span>NGÀY KÝ</span>
              <span>NGÀY ĐĂNG</span>
            </div>
            {latestDocs && latestDocs.length > 0 ? (
              latestDocs.map((doc) => {
                const category = categoryOf(doc.document_categories);
                const style = (category && CATEGORY_STYLE[category.slug]) || DEFAULT_STYLE;
                return (
                  <Link
                    key={doc.id}
                    href={`/van-ban/${doc.id}`}
                    className="grid gap-2 border-t px-5 py-5 text-[15px] first:border-t-0 hover:bg-accent/50 md:grid-cols-[150px_minmax(0,1fr)_130px_130px] md:items-center md:gap-6 md:px-7 md:first:border-t"
                  >
                    <span>
                      {category ? (
                        <Badge variant="secondary" className={`border-transparent ${style.badge}`}>
                          {category.label_vi}
                        </Badge>
                      ) : null}
                    </span>
                    <span className="font-semibold">
                      {doc.document_number ? `Số ${doc.document_number} — ` : ""}
                      {doc.title}
                    </span>
                    <span className="text-sm text-muted-foreground md:text-[15px]">
                      <span className="md:hidden">Ngày ký: </span>
                      {formatVNDate(doc.signed_date)}
                    </span>
                    <span className="text-sm text-muted-foreground md:text-[15px]">
                      <span className="md:hidden">Ngày đăng: </span>
                      {formatVNDate(doc.uploaded_date)}
                    </span>
                  </Link>
                );
              })
            ) : (
              <p className="px-7 py-8 text-sm text-muted-foreground">Chưa có văn bản nào được đăng.</p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 lg:flex-row lg:gap-16 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-2.5 lg:w-[400px] lg:shrink-0">
            <SectionHeading eyebrow="HỎI ĐÁP" title="Câu hỏi thường gặp" />
            <p className="text-base leading-relaxed text-muted-foreground">
              Chưa thấy câu trả lời? Gọi hotline {HOTLINE.display}.
            </p>
          </div>
          <div className="flex grow flex-col">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg font-semibold text-primary [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Plus className="size-6 shrink-0 text-[#9a6a1e] transition-transform group-open:rotate-45" />
                </summary>
                {Array.isArray(faq.a) ? (
                  <ul className="list-disc space-y-1.5 pb-6 pl-5 text-base leading-relaxed text-muted-foreground">
                    {faq.a.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="pb-6 text-base leading-relaxed text-muted-foreground">{faq.a}</p>
                )}
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-col gap-2">
            <span className="text-3xl font-extrabold text-primary">Sẵn sàng bắt đầu khóa học?</span>
            <span className="text-[17px] text-primary/80">
              Liên hệ Trung tâm để được tư vấn hạng học và lịch khai giảng.
            </span>
          </div>
          <div className="flex flex-col gap-3.5 sm:flex-row">
            <a
              href={HOTLINE.tel}
              className="flex h-13 items-center justify-center gap-2 rounded-lg bg-primary px-7 font-bold text-white transition-opacity hover:opacity-90"
            >
              <Phone className="size-4" />
              Gọi {HOTLINE.display}
            </a>
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-13 items-center justify-center rounded-lg border-[1.5px] border-primary px-7 font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
