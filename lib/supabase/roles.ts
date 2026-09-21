import { createClient } from "@/lib/supabase/server";

export async function isSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>): Promise<boolean> {
  const { data } = await supabase.rpc("is_super_admin");
  return data === true;
}
