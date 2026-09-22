"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email hoặc mật khẩu không đúng." };
  }

  redirect("/admin/documents");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    return { error: "Mật khẩu mới phải có ít nhất 8 ký tự." };
  }
  if (password !== confirmPassword) {
    return { error: "Mật khẩu nhập lại không khớp." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "Không xác định được tài khoản đang đăng nhập." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Mật khẩu hiện tại không đúng." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Đổi mật khẩu thất bại. Vui lòng thử lại." };
  }

  return { success: true };
}
