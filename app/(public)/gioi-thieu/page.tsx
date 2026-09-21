import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Giới thiệu",
};

const GALLERY = [
  {
    src: "/images/gallery/khai-giang-tap-huan.jpg",
    alt: "Lễ khai giảng lớp tập huấn giáo viên dạy thực hành tại Trung tâm giáo dục nghề nghiệp Hà An",
    caption: "Khai giảng lớp tập huấn giáo viên dạy thực hành",
  },
  {
    src: "/images/gallery/lop-hoc-bien-bao.jpg",
    alt: "Học viên trong lớp học hệ thống biển báo hiệu đường bộ",
    caption: "Lớp học hệ thống biển báo hiệu đường bộ",
  },
  {
    src: "/images/gallery/khu-vuc-sat-hach.jpg",
    alt: "Khu vực chờ thi sát hạch lái xe tại trung tâm",
    caption: "Khu vực chờ thi sát hạch lái xe",
  },
  {
    src: "/images/gallery/le-20-11.jpg",
    alt: "Lễ mít tinh tọa đàm chào mừng ngày Nhà giáo Việt Nam 20/11",
    caption: "Chào mừng ngày Nhà giáo Việt Nam 20/11",
  },
  {
    src: "/images/gallery/hoi-thi-giao-vien.jpg",
    alt: "Hội thi giáo viên dạy giỏi tại Trung tâm giáo dục nghề nghiệp Hà An",
    caption: "Hội thi giáo viên dạy giỏi",
  },
  {
    src: "/images/gallery/giai-bong-da.jpg",
    alt: "Trung tâm giáo dục nghề nghiệp Hà An tài trợ giải bóng đá nam học sinh sinh viên",
    caption: "Đồng hành cùng phong trào thể thao học sinh, sinh viên",
  },
  {
    src: "/images/gallery/ngay-8-3.jpg",
    alt: "Chúc mừng ngày Quốc tế Phụ nữ 8/3 tại văn phòng công ty",
    caption: "Kỷ niệm ngày Quốc tế Phụ nữ 8/3",
  },
];

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-wide">Giới thiệu</h1>
        <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground">
          <p>
            Trung tâm giáo dục nghề nghiệp Hà An là đơn vị đào tạo và sát hạch lái xe cơ giới
            đường bộ, với đội ngũ giáo viên giàu kinh nghiệm, đội xe sát hạch hiện đại và
            chương trình đào tạo bài bản, đúng quy định.
          </p>
          <p>
            Bên cạnh chuyên môn đào tạo, Trung tâm thường xuyên tổ chức các hoạt động tập
            huấn nâng cao nghiệp vụ giáo viên, giao lưu văn hóa - thể thao, cùng những dịp
            kỷ niệm ý nghĩa dành cho cán bộ, giáo viên và học viên.
          </p>
        </div>
      </div>

      <div className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold tracking-wide">Hoạt động tại Trung tâm</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {GALLERY.map((item) => (
              <figure
                key={item.src}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-foreground/10"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
