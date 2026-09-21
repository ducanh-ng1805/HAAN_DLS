import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Liên hệ",
};

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Địa chỉ",
    value: "Xóm Thiên Thai, Xã Toàn Lưu, Tỉnh Hà Tĩnh",
  },
  {
    icon: Phone,
    label: "Hotline",
    value: "0971 982 689",
    href: "tel:0971982689",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ttgdnnhaan@haandls.com",
    href: "mailto:ttgdnnhaan@haandls.com",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-wide">Liên hệ</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {CONTACT_INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="size-4" />
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="font-medium hover:text-primary hover:underline">
                    {item.value}
                  </a>
                ) : (
                  <div className="font-medium">{item.value}</div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
