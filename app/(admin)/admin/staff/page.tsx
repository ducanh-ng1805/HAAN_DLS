import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/supabase/roles";
import { addStaff } from "@/app/actions/staff";
import { formatVNDate } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StaffForm } from "./staff-form";
import { StaffRowActions } from "./staff-row-actions";

export default async function AdminStaffPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!(await isSuperAdmin(supabase))) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản trị viên</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bạn không có quyền truy cập trang này. Chỉ quản trị viên cao nhất mới quản lý được danh sách thành viên.
        </p>
      </div>
    );
  }

  const { data: staff } = await supabase
    .from("staff")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Quản trị viên</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quản trị viên cao nhất quản lý được cả tài liệu lẫn danh sách thành viên. Biên tập viên chỉ quản lý được tài
        liệu.
      </p>

      <div className="mt-6 max-w-lg">
        <StaffForm action={addStaff} />
      </div>

      <div className="mt-6 max-w-2xl rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày thêm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell>
                  <Badge variant={s.role === "super_admin" ? "default" : "secondary"}>
                    {s.role === "super_admin" ? "Quản trị viên cao nhất" : "Biên tập viên"}
                  </Badge>
                </TableCell>
                <TableCell>{formatVNDate(s.created_at)}</TableCell>
                <TableCell>
                  <StaffRowActions id={s.id} email={s.email} isSelf={s.email === user?.email?.toLowerCase()} />
                </TableCell>
              </TableRow>
            ))}
            {!staff?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Chưa có quản trị viên nào.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
