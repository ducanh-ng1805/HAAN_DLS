import { createClient } from "@/lib/supabase/server";
import { addStaff } from "@/app/actions/staff";
import { formatVNDate } from "@/lib/dates";
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
  const { data: staff } = await supabase
    .from("staff")
    .select("id, email, created_at")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Quản trị viên</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Chỉ email trong danh sách này mới có quyền quản lý tài liệu, kể cả khi đã đăng nhập được.
      </p>

      <div className="mt-6 max-w-md">
        <StaffForm action={addStaff} />
      </div>

      <div className="mt-6 max-w-2xl rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Ngày thêm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell>{formatVNDate(s.created_at)}</TableCell>
                <TableCell>
                  <StaffRowActions id={s.id} email={s.email} />
                </TableCell>
              </TableRow>
            ))}
            {!staff?.length ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
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
