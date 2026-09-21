import { z } from "zod";

export const staffFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["super_admin", "editor"]).default("editor"),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
