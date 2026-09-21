"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

type Action = (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;

export function StaffForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <div>
      <form ref={formRef} action={formAction} className="flex items-end gap-3">
        <Field className="flex-1">
          <FieldLabel htmlFor="email">Email quản trị viên mới</FieldLabel>
          <Input id="email" name="email" type="email" required placeholder="ten@haancorp.com" />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Đang thêm..." : "Thêm"}
        </Button>
      </form>
      {state?.error ? <p className="mt-2 text-sm text-destructive">{state.error}</p> : null}
    </div>
  );
}
