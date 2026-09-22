import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/supabase/roles";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { AdminNav } from "../admin-nav";
import { ChangePasswordDialog } from "../change-password-dialog";

export default async function AdminStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const superAdmin = await isSuperAdmin(supabase);

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/admin/documents" className="flex items-center gap-2 font-semibold">
              <Image
                src="/logo.jpg"
                alt="Trung tâm đào tạo & sát hạch Hà An"
                width={32}
                height={32}
                className="rounded"
              />
              <span>Quản trị Hà An</span>
            </Link>
            <AdminNav isSuperAdmin={superAdmin} />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{user?.email}</span>
            <ChangePasswordDialog />
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
