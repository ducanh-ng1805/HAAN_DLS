import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate } from "@/lib/dates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Khóa học & học phí",
};

const COURSES = [
  { code: "B", name: "Hạng B - Ô tô số tự động/số sàn dưới 9 chỗ" },
  { code: "C1", name: "Hạng C1 - Ô tô tải, ô tô chuyên dùng" },
  { code: "BSTĐ", name: "Hạng B (số tự động)" },
  { code: "BK", name: "Hạng B (số sàn)" },
];

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: latestFeeDoc } = await supabase
    .from("documents")
    .select("id, title, document_number, signed_date, uploaded_date, category_id, document_categories(slug)")
    .eq("status", "published")
    .in("document_categories.slug", ["quyet-dinh", "thong-bao"])
    .order("signed_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Khóa học & học phí</h1>
      <p className="mt-3 text-muted-foreground">
        Trung tâm đào tạo các hạng bằng lái xe cơ giới đường bộ. Mức học phí thay đổi theo
        từng thời điểm, được cập nhật đầy đủ qua các thông báo/quyết định chính thức bên dưới.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {COURSES.map((course) => (
          <Card key={course.code}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Chi tiết học phí và điều kiện tuyển sinh xem tại văn bản chính thức mới nhất.
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Thông báo học phí mới nhất</CardTitle>
        </CardHeader>
        <CardContent>
          {latestFeeDoc ? (
            <div className="flex flex-col gap-2 text-sm">
              <div className="font-medium">{latestFeeDoc.title}</div>
              <div className="text-muted-foreground">
                {latestFeeDoc.document_number ? `Số: ${latestFeeDoc.document_number} · ` : ""}
                Ngày ký: {formatVNDate(latestFeeDoc.signed_date)}
              </div>
              <Button
                variant="outline"
                className="mt-2 w-fit"
                nativeButton={false}
                render={<Link href={`/van-ban/${latestFeeDoc.id}`}>Xem chi tiết</Link>}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có thông báo học phí nào được đăng.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
