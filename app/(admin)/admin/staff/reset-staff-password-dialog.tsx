"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { resetStaffPassword } from "@/app/actions/staff";

export function ResetStaffPasswordDialog({ id, email }: { id: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(resetStaffPassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(`Đã đổi mật khẩu cho ${email}.`);
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, email]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        Đặt lại mật khẩu
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu cho {email}</DialogTitle>
          <DialogDescription>
            Mật khẩu mới cần có ít nhất 8 ký tự. Thành viên này sẽ dùng mật khẩu mới ở lần đăng nhập tiếp theo.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={id} />
          <Field>
            <FieldLabel htmlFor={`reset-password-${id}`}>Mật khẩu mới</FieldLabel>
            <Input id={`reset-password-${id}`} name="password" type="password" required minLength={8} />
          </Field>
          <Field>
            <FieldLabel htmlFor={`reset-confirm-${id}`}>Nhập lại mật khẩu mới</FieldLabel>
            <Input id={`reset-confirm-${id}`} name="confirmPassword" type="password" required minLength={8} />
          </Field>
          {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : "Lưu mật khẩu mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
