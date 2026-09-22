import Link from "next/link";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatVNDate } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentActions } from "./document-actions";

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select(
      "id, title, document_number, signed_date, uploaded_date, status, featured, file_url, document_categories(label_vi)"
    )
    .order("signed_date", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tài liệu</h1>
        <Button nativeButton={false} render={<Link href="/admin/documents/new">+ Thêm tài liệu</Link>} />
      </div>

      <div className="mt-6 rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ngày ký</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc) => {
              const category = Array.isArray(doc.document_categories)
                ? doc.document_categories[0]
                : doc.document_categories;
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1.5">
                      {doc.featured ? (
                        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-500" />
                      ) : null}
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {doc.title}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>{category?.label_vi ?? "-"}</TableCell>
                  <TableCell>{formatVNDate(doc.signed_date)}</TableCell>
                  <TableCell>{formatVNDate(doc.uploaded_date)}</TableCell>
                  <TableCell>
                    <Badge variant={doc.status === "published" ? "default" : "secondary"}>
                      {doc.status === "published" ? "Đã đăng" : "Nháp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DocumentActions id={doc.id} status={doc.status} featured={doc.featured} />
                  </TableCell>
                </TableRow>
              );
            })}
            {!documents?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Chưa có tài liệu nào.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
