"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";

type Category = { id: string; label_vi: string };

type DocumentFormValues = {
  title: string;
  document_number: string | null;
  category_id: string;
  signed_date: string | null;
  content: string | null;
  status: "draft" | "published";
};

type Action = (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;

export function DocumentForm({
  categories,
  action,
  defaultValues,
  submitLabel,
}: {
  categories: Category[];
  action: Action;
  defaultValues?: DocumentFormValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Tên tài liệu</FieldLabel>
          <Input id="title" name="title" required defaultValue={defaultValues?.title} />
        </Field>

        <Field>
          <FieldLabel htmlFor="document_number">Số văn bản</FieldLabel>
          <Input
            id="document_number"
            name="document_number"
            placeholder="VD: 11/TB-HA"
            defaultValue={defaultValues?.document_number ?? ""}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="category_id">Loại văn bản</FieldLabel>
          <Select name="category_id" defaultValue={defaultValues?.category_id}>
            <SelectTrigger id="category_id" className="w-full">
              <SelectValue placeholder="Chọn loại văn bản" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label_vi}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="signed_date">Ngày ký</FieldLabel>
          <Input
            id="signed_date"
            name="signed_date"
            type="date"
            defaultValue={defaultValues?.signed_date ?? ""}
          />
          <FieldDescription>
            Để trống nếu chưa rõ ngày ký chính thức — hệ thống sẽ tự lấy ngày đăng tải làm ngày ký.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="file">File PDF</FieldLabel>
          <Input id="file" name="file" type="file" accept="application/pdf" />
          <FieldDescription>
            {defaultValues
              ? "Để trống nếu không thay file. Thay file mới sẽ tự tăng số phiên bản."
              : "Bắt buộc chọn file PDF."}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="content">Nội dung (tùy chọn)</FieldLabel>
          <Textarea id="content" name="content" rows={5} defaultValue={defaultValues?.content ?? ""} />
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Trạng thái</FieldLabel>
          <Select name="status" defaultValue={defaultValues?.status ?? "draft"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="published">Đăng công khai</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Đang lưu..." : submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
