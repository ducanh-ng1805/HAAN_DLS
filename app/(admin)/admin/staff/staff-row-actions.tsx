"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { removeStaff } from "@/app/actions/staff";
import { ResetStaffPasswordDialog } from "./reset-staff-password-dialog";

export function StaffRowActions({ id, email, isSelf }: { id: string; email: string; isSelf: boolean }) {
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

  if (isSelf) {
    return <div className="flex justify-end text-sm text-muted-foreground">Bạn</div>;
  }

  return (
    <div className="flex justify-end gap-2">
      <ResetStaffPasswordDialog id={id} email={email} />
      <Button size="sm" variant="destructive" disabled={pending} onClick={onDelete}>
        Xóa
      </Button>
    </div>
  );
}
