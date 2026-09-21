import Link from "next/link";
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
      <section className="border-b bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trung tâm đào tạo lái xe HAAN DLS
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Đồng hành cùng học viên trên hành trình lấy bằng lái xe an toàn, đúng quy định
            và minh bạch về học phí.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/khoa-hoc">Xem khóa học & học phí</Link>} />
            <Button size="lg" variant="outline" render={<Link href="/van-ban">Thông báo & văn bản</Link>} />
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
