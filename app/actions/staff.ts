"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/supabase/roles";
import { staffFormSchema } from "@/lib/schemas/staff";

type ActionState = { error?: string } | undefined;

export async function addStaff(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = staffFormSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email không hợp lệ." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("staff")
    .insert({ email: parsed.data.email.toLowerCase(), role: parsed.data.role });

  if (error) {
    return {
      // 23505 = unique_violation, 42501 = insufficient_privilege (RLS block, e.g. an editor trying to add someone)
      error:
        error.code === "23505"
          ? "Email này đã có trong danh sách."
          : error.code === "42501"
            ? "Bạn không có quyền quản lý danh sách quản trị viên."
            : `Thêm thất bại: ${error.message}`,
    };
  }

  revalidatePath("/admin/staff");
}

export async function removeStaff(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: target } = await supabase.from("staff").select("email, role").eq("id", id).single();
  if (!target) throw new Error("Không tìm thấy thành viên này.");

  if (user?.email && target.email.toLowerCase() === user.email.toLowerCase()) {
    // Deleting your own row makes is_staff()/is_super_admin() false for the
    // rest of this request, which hides the whole staff table from you via
    // RLS (looks like everything got wiped, not just your row). Block it up front.
    throw new Error("Không thể tự xóa quyền quản trị của chính mình.");
  }

  if (target.role === "super_admin") {
    const { count } = await supabase
      .from("staff")
      .select("id", { count: "exact", head: true })
      .eq("role", "super_admin");
    if ((count ?? 0) <= 1) {
      throw new Error("Không thể xóa quản trị viên cao nhất cuối cùng.");
    }
  }

  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/staff");
}

export async function resetStaffPassword(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const id = String(formData.get("id") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const supabase = await createClient();
  if (!(await isSuperAdmin(supabase))) {
    return { error: "Bạn không có quyền thực hiện thao tác này." };
  }

  if (password.length < 8) {
    return { error: "Mật khẩu mới phải có ít nhất 8 ký tự." };
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu nhập lại không khớp." };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      error:
        "Chưa cấu hình SUPABASE_SERVICE_ROLE_KEY trên máy chủ. Vào Vercel > Settings > Environment Variables để thêm rồi redeploy.",
    };
  }

  const { data: target } = await supabase.from("staff").select("email").eq("id", id).single();
  if (!target) {
    return { error: "Không tìm thấy thành viên này." };
  }

  try {
    const admin = createAdminClient();
    const { data: list, error: listError } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listError) {
      return { error: `Không thể tra cứu tài khoản đăng nhập: ${listError.message}` };
    }

    const authUser = list.users.find((u) => u.email?.toLowerCase() === target.email.toLowerCase());
    if (!authUser) {
      return { error: "Thành viên này chưa có tài khoản đăng nhập trên hệ thống." };
    }

    const { error } = await admin.auth.admin.updateUserById(authUser.id, { password });
    if (error) {
      return { error: `Đổi mật khẩu thất bại: ${error.message}` };
    }

    return { success: true };
  } catch (e) {
    return {
      error: e instanceof Error ? `Lỗi hệ thống: ${e.message}` : "Lỗi hệ thống không xác định.",
    };
  }
}
