"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { setDocumentStatus, deleteDocument } from "@/app/actions/documents";
import type { DocumentStatus } from "@/types/database";

export function DocumentActions({ id, status }: { id: string; status: DocumentStatus }) {
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
      <Button size="sm" variant="outline" disabled={pending} onClick={toggleStatus}>
        {status === "published" ? "Ẩn" : "Đăng"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        render={<Link href={`/admin/documents/${id}/edit`}>Sửa</Link>}
      />
      <Button size="sm" variant="destructive" disabled={pending} onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
}
