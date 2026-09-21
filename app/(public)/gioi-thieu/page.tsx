import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Giới thiệu</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-muted-foreground">
        <p>
          Nội dung giới thiệu về Trung tâm đào tạo lái xe HAAN DLS sẽ được cập nhật tại đây:
          lịch sử hình thành, đội ngũ giáo viên, cơ sở vật chất và thế mạnh đào tạo.
        </p>
        <p>Vui lòng liên hệ để cung cấp nội dung chính thức.</p>
      </div>
    </div>
  );
}
