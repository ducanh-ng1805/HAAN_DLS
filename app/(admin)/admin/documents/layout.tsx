import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/admin/documents" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="HAAN DLS" width={32} height={32} className="rounded" />
            <span>Quản trị HAAN DLS</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{user?.email}</span>
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
