// One-off local correction: the first import (scripts/import-hoc-phi.mjs) left
// signed_date blank (defaulting to uploaded_date) for all 70 bulk-imported PDFs.
// These are pre-existing historical documents whose real ngày ký is printed
// inside each file, so it should have been extracted instead of defaulted —
// this script applies that correction using dates read from each PDF.
//
// Usage: node --env-file=.env.local scripts/fix-signed-dates.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// filename (as on disk, minus extension) -> real signed date extracted from the PDF content.
const SIGNED_DATES = [
  { filename: "11TB- ĐIỀU CHỈNH HP HẠNG C1K005.pdf", signed_date: "2026-03-11" },
  { filename: "12TB-ĐIỀU CHỈNH HP HẠNG C1K004.pdf", signed_date: "2026-03-11" },
  { filename: "135. QĐ điều chỉnh học phí áp dụng các khóa báo cáo 1.pdf", signed_date: "2025-12-31" },
  { filename: "13TB- ĐIỀU CHỈNH HP HẠNG BK137.pdf", signed_date: "2026-03-11" },
  { filename: "14TB-ĐIỀU CHỈNH HP BK136.pdf", signed_date: "2026-03-11" },
  { filename: "15TB- ĐIỀU CHỈNH HP HẠNG BSTĐ K103.pdf", signed_date: "2026-03-11" },
  { filename: "16TB-ĐIỀU CHỈNH HP HẠNG BSTĐ K102.pdf", signed_date: "2026-03-11" },
  { filename: "17TB-ĐIỀU CHỈNH HP HẠNG BSTĐ K101.pdf", signed_date: "2026-03-11" },
  { filename: "18TB- ĐIỀU CHỈNH HP HẠNG BSTĐ K100.pdf", signed_date: "2026-03-11" },
  { filename: "19TB- ĐIỀU CHỈNH HP HẠNG BSTĐ K099.pdf", signed_date: "2026-03-11" },
  { filename: "20TB- ĐIỀU CHỈNH HP ĐÀO TẠO LÁI XE CƠ GIỚI.pdf", signed_date: "2026-03-11" },
  { filename: "21.QĐ điều chỉnh học phí đào tạo lái xe cơ giới đường bộ.pdf", signed_date: "2026-03-11" },
  { filename: "24TB-VV ĐIỀU CHỈNH HP HẠNG C1K004 (1).pdf", signed_date: "2026-03-25" },
  { filename: "27TB- VV ĐIỀU CHỈNH HỌC PHÍ ĐÀO TẠO LÁI XE CGĐB.pdf", signed_date: "2026-04-06" },
  { filename: "27TB-VV ĐIỀU CHỈNH HỌC PHÍ ĐÀO TẠO LÁI XE NGÀY 06.04.2026.pdf", signed_date: "2026-04-06" },
  { filename: "28. QĐ điều chỉnh học phí đào tạo C1K004.pdf", signed_date: "2026-03-25" },
  { filename: "28QĐ- VV ĐIỀU CHỈNH HP HẠNG C1K004.pdf", signed_date: "2026-03-25" },
  { filename: "29TB-VV ĐIỀU CHỈNH HP HẠNG C1K007.pdf", signed_date: "2026-04-11" },
  { filename: "30TB-VV ĐIỀU CHỈNH HP NGÀY 11.04.2026.pdf", signed_date: "2026-04-11" },
  { filename: "34. QĐ điều chỉnh học phí đào tạo lái xe cơ giới đường bộ.pdf", signed_date: "2026-04-06" },
  { filename: "34QĐ- VV ĐIỀU CHỈNH HP ĐÀO TẠO LÁI XE CƠ GIỚI ĐƯỜNG BỘ NGÀY 06.04.2026.pdf", signed_date: "2026-04-06" },
  { filename: "34TB-VV ĐIỀU CHỈNH HP KHÓA C1K005.pdf", signed_date: "2026-04-18" },
  { filename: "35TB-VV ĐIỀU CHỈNH HỌC PHÍ ĐÀO TẠO LÁI XE CƠ GỚI HẠNG BSTĐK102.pdf", signed_date: "2026-04-20" },
  { filename: "37. QĐ điều chỉnh học phí ngày 11.04.2026.pdf", signed_date: "2026-04-11" },
  { filename: "37QĐ- ĐIỀU CHỈNH HP NGÀY 11.04.2026.pdf", signed_date: "2026-04-11" },
  { filename: "37TB-VV ĐIỀU CHỈNH HP KHÓA BSTĐK103.pdf", signed_date: "2026-04-26" },
  { filename: "38. QĐ điều chỉnh học phí DTLXCGBD C1K005.pdf", signed_date: "2026-04-18" },
  { filename: "38QĐ-VV ĐIỀU CHỈNH HP HẠNG C1K005.pdf", signed_date: "2026-04-18" },
  { filename: "39. QĐ điều chỉnh học phí ĐTLXCGDB BSTĐK102.pdf", signed_date: "2026-04-20" },
  { filename: "39QĐ-VV ĐIỀU CHỈNH HP HẠNG BSTĐK102.pdf", signed_date: "2026-04-20" },
  { filename: "39QĐ-ĐIỀU CHỈNH HỌC PHÍ ĐÀO TẠO LÁI XE CƠ GIỚI ĐƯỜNG BỘ.pdf", signed_date: "2026-04-20" },
  { filename: "41-2026-QĐ VV ĐIỀU CHỈNH HP KHÓA 103.pdf", signed_date: "2026-04-26" },
  { filename: "41. QĐ điều chỉnh học phí đào tạo lái xe BSTĐK103.pdf", signed_date: "2026-04-26" },
  { filename: "41TB-VV ĐIỀU CHỈNH HP KHÓA BSTĐ K104 VÀ BK138.pdf", signed_date: "2026-05-15" },
  { filename: "45. QĐ điều chỉnh học phí DTLXCGDB  BSTDDK và BK138.pdf", signed_date: "2026-05-15" },
  { filename: "45QĐ-VV ĐIỀU CHỈNH HP KHÓA BSTĐK104 VÀ BK138.pdf", signed_date: "2026-05-15" },
  { filename: "45TB- ĐIỀU CHỈNH HP BK139 VÀ C1K006.pdf", signed_date: "2026-05-28" },
  { filename: "48. QĐ điều chỉnh học phí đào tạo lái xe cơ giới đường bộ.pdf", signed_date: "2026-05-28" },
  { filename: "48QĐ-ĐIỀU CHỈNH HP KHÓA BK139 VÀ C1K006.pdf", signed_date: "2026-05-28" },
  { filename: "49. TB điều chỉnh học phí đào tạo lái xe cơ giới đường bộ BSTĐK105.pdf", signed_date: "2026-06-09" },
  { filename: "50TB-VV ĐIỀU CHỈNH HP HẠNG BSTĐK106.pdf", signed_date: "2026-06-12" },
  { filename: "51. QĐ điều chỉnh học phí đào tạo lái xe cơ giới đường bộ BSTĐK105.pdf", signed_date: "2026-06-09" },
  { filename: "53. QĐ điều chỉnh học phí BSTĐK106.pdf", signed_date: "2026-06-12" },
  { filename: "53QĐ-VV ĐIỀU CHỈNH HP HẠNG BSTĐK106.pdf", signed_date: "2026-06-12" },
  { filename: "54. TB ban hành mức học phí đào tạo lái xe áp dụng từ ngày 20.06.2026.pdf", signed_date: "2026-06-20" },
  { filename: "56 2026 QĐ Vv ban hành mức học phí đào tạo lái xe ô tô áp dụng từ ngày 20-6-2026.pdf", signed_date: "2026-06-19" },
  { filename: "56. QĐ Vv ban hành mức học phí ĐTLX ô tô áp dụng từ ngày 20.06.2026.pdf", signed_date: "2026-06-19" },
  { filename: "57-QĐ ĐIỀU CHỈNH HP HẠNG BSTĐ K107, C1K007.pdf", signed_date: "2026-06-24" },
  { filename: "57. QĐ điều chỉnh học phí lái xe cơ giới đường bộ BSTDK107 và C1K007.pdf", signed_date: "2026-06-24" },
  { filename: "58. QĐ điều chỉnh học phí đào tạo lái xe cơ giới đường bộ BK140.pdf", signed_date: "2026-06-27" },
  { filename: "58QĐ- VV ĐIỀU CHỈNH HP KHÓA BK140.pdf", signed_date: "2026-06-27" },
  { filename: "59. QĐ điều chỉnh học phí đào tạo lái xe BSTDK108.pdf", signed_date: "2026-06-30" },
  { filename: "59QĐ-QĐ ĐIỀU CHỈNH HP KHÓA BSTĐK108.pdf", signed_date: "2026-06-30" },
  { filename: "62QĐ-ĐIỀU CHỈNH HP HẠNG BK141.pdf", signed_date: "2026-07-13" },
  { filename: "63QĐ-VV ĐIỀU CHỈNH HP KHÓA BSTĐK109.pdf", signed_date: "2026-07-18" },
  { filename: "63QĐ-VV ĐIỀU CHỈNH HP ĐƯỜNG BỘ KHÓA BSTĐ K109.pdf", signed_date: "2026-07-18" },
  { filename: "64QĐ-VV ĐIỀU CHỈNH HP KHÓA BSTĐK110.pdf", signed_date: "2026-07-23" },
  { filename: "68QĐ-ĐIỀU CHỈNH HP BSTĐ K111 VÀ C1K008.pdf", signed_date: "2026-08-04" },
  { filename: "71QĐ-GDNNHA VV ĐIỀU CHỈNH HP KHÓA BK142.pdf", signed_date: "2026-08-11" },
  { filename: "73QĐ-VV ĐIỀU CHỈNH HP KHÓA BSTĐ K112.pdf", signed_date: "2026-08-13" },
  { filename: "74. Thông báo điều chỉnh học phí đào tạo khóa C1K009.pdf", signed_date: "2026-08-26" },
  { filename: "76. QĐ Vv ban hành mức học phí đào tạo lái xe ô tô áp dụng từ ngày 22.08.2026.pdf", signed_date: "2026-08-21" },
  { filename: "78TB-VV ĐIỀU CHỈNH MỨC THU PHÍ KIỂM TRA LẠI KẾT THÚC KHÓA HỌC.pdf", signed_date: "2026-09-11" },
  { filename: "79. QĐ điều chỉnh học phí đào tạo khóa C1K009.pdf", signed_date: "2026-08-26" },
  { filename: "85. QĐ điều chỉnh mức thu phí kiểm tra lại kết thúc các môn học.pdf", signed_date: "2026-09-11" },
  { filename: "QĐ VV ĐIỀU CHỈNH MỨC THU PHÍ KIỂM TRA LẠI KẾT THÚC KHÓA HỌC.pdf", signed_date: "2026-09-11" },
  { filename: "110QĐ-TL TỔ BIÊN SOẠN GIÁO TRÌNH VÀ CHƯƠNG TRÌNH ĐÀO TẠO CHI TIẾT THEO TT17.pdf", signed_date: "2026-06-23" },
  { filename: "QĐ BAN HÀNH CHƯƠNG TRÌNH VÀ GIÁO TRÌNH THEO THÔNG TƯ 14.pdf", signed_date: "2025-08-30" },
  { filename: "QĐ BAN HÀNH QUY CHẾ TUYỂN SINH NĂM 2025.pdf", signed_date: "2025-01-02" },
  { filename: "QĐ BAN HÀNH QUY CHẾ ĐÀO TẠO TỪ XA, TỰ HỌC CÓ HƯỚNG DẪN.pdf", signed_date: "2025-02-25" },
];

function titleFromFilename(filename) {
  return filename.replace(/\.pdf$/i, "").trim();
}

async function main() {
  let updated = 0;
  let notFound = 0;

  for (const { filename, signed_date } of SIGNED_DATES) {
    const title = titleFromFilename(filename);

    const { data, error } = await supabase
      .from("documents")
      .update({ signed_date })
      .eq("title", title)
      .select("id");

    if (error) {
      console.error(`Update failed for "${title}": ${error.message}`);
      continue;
    }
    if (!data || data.length === 0) {
      console.warn(`No matching row for title: "${title}"`);
      notFound++;
      continue;
    }
    console.log(`Set signed_date=${signed_date} for: ${title}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}, no match for ${notFound} (expected total: ${SIGNED_DATES.length}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
