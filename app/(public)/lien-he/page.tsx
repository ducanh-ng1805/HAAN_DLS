import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Liên hệ",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Liên hệ</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Địa chỉ: đang cập nhật.</p>
          <p>Điện thoại: đang cập nhật.</p>
          <p>Email: đang cập nhật.</p>
        </CardContent>
      </Card>
    </div>
  );
}
