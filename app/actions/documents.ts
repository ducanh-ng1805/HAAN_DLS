"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { documentFormSchema } from "@/lib/schemas/document";
import type { Database, DocumentStatus } from "@/types/database";

type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

type ActionState = { error?: string } | undefined;

function revalidatePublicPaths(id?: string) {
  revalidatePath("/van-ban");
  revalidatePath("/");
  revalidatePath("/khoa-hoc");
  if (id) revalidatePath(`/van-ban/${id}`);
}

async function uploadFileIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File | null,
  categorySlug: string
) {
  if (!file || file.size === 0) return null;

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${categorySlug}/${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from("documents").upload(path, file, {
    contentType: file.type || "application/pdf",
  });
  if (error) throw new Error(`Tải file thất bại: ${error.message}`);

  const { data } = supabase.storage.from("documents").getPublicUrl(path);
  return data.publicUrl;
}

export async function createDocument(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = documentFormSchema.safeParse({
    title: formData.get("title"),
    document_number: formData.get("document_number") || undefined,
    category_id: formData.get("category_id"),
    signed_date: formData.get("signed_date") || undefined,
    content: formData.get("content") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };
  }

  const supabase = await createClient();
  const file = formData.get("file") as File | null;

  const { data: category } = await supabase
    .from("document_categories")
    .select("slug")
    .eq("id", parsed.data.category_id)
    .single();

  if (!category) return { error: "Loại văn bản không hợp lệ." };

  let fileUrl: string | null;
  try {
    fileUrl = await uploadFileIfPresent(supabase, file, category.slug);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Tải file thất bại." };
  }
  if (!fileUrl) return { error: "Vui lòng chọn file PDF." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("documents").insert({
    title: parsed.data.title,
    document_number: parsed.data.document_number || null,
    category_id: parsed.data.category_id,
    signed_date: parsed.data.signed_date || null, // null -> DB trigger defaults to uploaded_date
    content: parsed.data.content || null,
    status: parsed.data.status as DocumentStatus,
    file_url: fileUrl,
    created_by: user?.id ?? null,
  });

  if (error) return { error: `Lưu tài liệu thất bại: ${error.message}` };

  revalidatePublicPaths();
  redirect("/admin/documents");
}

export async function updateDocument(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = documentFormSchema.safeParse({
    title: formData.get("title"),
    document_number: formData.get("document_number") || undefined,
    category_id: formData.get("category_id"),
    signed_date: formData.get("signed_date") || undefined,
    content: formData.get("content") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ." };
  }

  const supabase = await createClient();
  const file = formData.get("file") as File | null;

  const { data: category } = await supabase
    .from("document_categories")
    .select("slug")
    .eq("id", parsed.data.category_id)
    .single();

  if (!category) return { error: "Loại văn bản không hợp lệ." };

  let fileUrl: string | null = null;
  try {
    fileUrl = await uploadFileIfPresent(supabase, file, category.slug);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Tải file thất bại." };
  }

  const update: DocumentUpdate = {
    title: parsed.data.title,
    document_number: parsed.data.document_number || null,
    category_id: parsed.data.category_id,
    content: parsed.data.content || null,
    status: parsed.data.status as DocumentStatus,
  };
  // signed_date is a deliberate admin edit here, not a system re-derivation,
  // so we only touch it when the admin actually submitted a value.
  if (parsed.data.signed_date) update.signed_date = parsed.data.signed_date;
  if (fileUrl) update.file_url = fileUrl; // triggers version bump via DB trigger

  const { error } = await supabase.from("documents").update(update).eq("id", id);

  if (error) return { error: `Cập nhật thất bại: ${error.message}` };

  revalidatePublicPaths(id);
  redirect("/admin/documents");
}

export async function setDocumentStatus(id: string, status: DocumentStatus) {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths(id);
  revalidatePath("/admin/documents");
}

export async function deleteDocument(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePublicPaths(id);
  revalidatePath("/admin/documents");
}
