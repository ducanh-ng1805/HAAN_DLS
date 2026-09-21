"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { staffFormSchema } from "@/lib/schemas/staff";

type ActionState = { error?: string } | undefined;

export async function addStaff(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = staffFormSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email không hợp lệ." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("staff").insert({ email: parsed.data.email.toLowerCase() });

  if (error) {
    return {
      error: error.code === "23505" ? "Email này đã có trong danh sách." : `Thêm thất bại: ${error.message}`,
    };
  }

  revalidatePath("/admin/staff");
}

export async function removeStaff(id: string) {
  const supabase = await createClient();

  const { count } = await supabase.from("staff").select("id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) {
    throw new Error("Không thể xóa quản trị viên cuối cùng.");
  }

  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/staff");
}
