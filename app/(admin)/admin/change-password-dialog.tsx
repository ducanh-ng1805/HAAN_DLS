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
import { changePassword } from "@/app/actions/auth";

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(changePassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Đã đổi mật khẩu.");
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" />}>
        Đổi mật khẩu
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>Mật khẩu mới cần có ít nhất 8 ký tự.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="currentPassword">Mật khẩu hiện tại</FieldLabel>
            <Input id="currentPassword" name="currentPassword" type="password" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Mật khẩu mới</FieldLabel>
            <Input id="password" name="password" type="password" required minLength={8} />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Nhập lại mật khẩu mới</FieldLabel>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
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
