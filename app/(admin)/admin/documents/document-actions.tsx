"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setDocumentStatus, setDocumentFeatured, deleteDocument } from "@/app/actions/documents";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types/database";

export function DocumentActions({
  id,
  status,
  featured,
}: {
  id: string;
  status: DocumentStatus;
  featured: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function toggleStatus() {
    const next: DocumentStatus = status === "published" ? "draft" : "published";
    startTransition(async () => {
      try {
        await setDocumentStatus(id, next);
        toast.success(next === "published" ? "Đã đăng tài liệu." : "Đã ẩn tài liệu.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Thao tác thất bại.");
      }
    });
  }

  function toggleFeatured() {
    startTransition(async () => {
      try {
        await setDocumentFeatured(id, !featured);
        toast.success(!featured ? "Đã đánh dấu nổi bật." : "Đã bỏ đánh dấu nổi bật.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Thao tác thất bại.");
      }
    });
  }

  function onDelete() {
    if (!confirm("Xóa tài liệu này? Hành động không thể hoàn tác.")) return;
    startTransition(async () => {
      try {
        await deleteDocument(id);
        toast.success("Đã xóa tài liệu.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Xóa thất bại.");
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="icon-sm"
        variant="outline"
        disabled={pending}
        onClick={toggleFeatured}
        title={featured ? "Bỏ đánh dấu nổi bật" : "Đánh dấu nổi bật (hiện ở trang chủ)"}
      >
        <Star className={cn("size-4", featured && "fill-amber-400 text-amber-500")} />
      </Button>
      <Button size="sm" variant="outline" disabled={pending} onClick={toggleStatus}>
        {status === "published" ? "Ẩn" : "Đăng"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        nativeButton={false}
        render={<Link href={`/admin/documents/${id}/edit`}>Sửa</Link>}
      />
      <Button size="sm" variant="destructive" disabled={pending} onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
}
