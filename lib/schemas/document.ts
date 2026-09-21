import { z } from "zod";

export const documentFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên tài liệu"),
  document_number: z.string().optional(),
  category_id: z.string().min(1, "Vui lòng chọn loại văn bản"),
  signed_date: z.string().optional(), // yyyy-MM-dd; blank -> DB trigger defaults to uploaded_date
  content: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;
