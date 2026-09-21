import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HIGHLIGHTS = [
  {
    title: "Đào tạo bài bản",
    desc: "Chương trình đào tạo lái xe theo đúng quy định, đội ngũ giáo viên giàu kinh nghiệm.",
  },
  {
    title: "Học phí minh bạch",
    desc: "Mọi thông báo, quyết định điều chỉnh học phí đều được công khai đầy đủ trên website.",
  },
  {
    title: "Nhiều hạng đào tạo",
    desc: "Đào tạo đa dạng các hạng bằng lái xe cơ giới đường bộ.",
  },
];

export default function HomePage() {
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
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {item.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
