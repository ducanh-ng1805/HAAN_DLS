import { z } from "zod";

export const staffFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
