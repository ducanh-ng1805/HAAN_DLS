"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeStaff } from "@/app/actions/staff";

export function StaffRowActions({ id, email }: { id: string; email: string }) {
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm(`Xóa quyền quản trị của ${email}?`)) return;
    startTransition(async () => {
      try {
        await removeStaff(id);
        toast.success("Đã xóa quản trị viên.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Xóa thất bại.");
      }
    });
  }

  return (
    <div className="flex justify-end">
      <Button size="sm" variant="destructive" disabled={pending} onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
}
