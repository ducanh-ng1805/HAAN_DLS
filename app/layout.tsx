import type { Metadata } from "next";
import { Be_Vietnam_Pro, Oswald, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TRUNG TÂM GIÁO DỤC NGHỀ NGHIỆP HÀ AN",
    template: "%s | TRUNG TÂM GIÁO DỤC NGHỀ NGHIỆP HÀ AN",
  },
  description:
    "TRUNG TÂM GIÁO DỤC NGHỀ NGHIỆP HÀ AN - Tiên phong về đào tạo & sát hạch lái xe: thông tin khóa học, học phí và văn bản chính thức.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${oswald.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
