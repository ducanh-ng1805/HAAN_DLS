import { format, parseISO } from "date-fns";

export function formatVNDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd/MM/yyyy");
}

/**
 * signedDate defaults to uploadedDate at insert time (DB trigger).
 * Only surface "Ngày đăng tải" when the two dates are explicitly distinct.
 */
export function shouldShowUploadedDate(signedDate: string, uploadedDate: string): boolean {
  return signedDate !== uploadedDate;
}
