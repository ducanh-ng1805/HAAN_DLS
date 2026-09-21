// One-off local import: uploads existing PDFs into Supabase Storage and creates
// draft `documents` rows for the admin to review (real signedDate, category,
// document_number) before publishing. Never deployed, never run in CI.
//
// Usage (from project root, after supabase/migrations/0001_init.sql has been applied):
//   node --env-file=.env.local scripts/import-hoc-phi.mjs
//
// Requires in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...   (service role key, local use only, never commit)

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const SOURCES = [
  {
    dir: "học phí",
    guessCategory: (filenameLower) => {
      if (filenameLower.includes("qđ")) return "quyet-dinh";
      if (filenameLower.includes("tb") || filenameLower.includes("thông báo")) return "thong-bao";
      return "thong-bao-trung-tam";
    },
  },
  {
    dir: "QUY CHẾ QUY ĐỊNH",
    guessCategory: (filenameLower) => {
      if (filenameLower.includes("tuyển sinh")) return "quy-che-tuyen-sinh";
      if (filenameLower.includes("đào tạo")) return "quy-che-dao-tao";
      return "van-ban-phap-ly";
    },
  },
];

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

async function main() {
  const { data: categories, error: catError } = await supabase
    .from("document_categories")
    .select("id, slug");
  if (catError) throw catError;
  const categoryIdBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  let imported = 0;
  let skipped = 0;

  for (const source of SOURCES) {
    let files;
    try {
      files = (await readdir(source.dir)).filter((f) => extname(f).toLowerCase() === ".pdf");
    } catch {
      console.warn(`Skip missing folder: ${source.dir}`);
      continue;
    }

    for (const filename of files) {
      const title = basename(filename, extname(filename)).trim();

      const { data: existing } = await supabase
        .from("documents")
        .select("id")
        .eq("title", title)
        .maybeSingle();
      if (existing) {
        console.log(`Already imported, skip: ${title}`);
        skipped++;
        continue;
      }

      const categorySlug = source.guessCategory(filename.toLowerCase());
      const categoryId = categoryIdBySlug[categorySlug];
      if (!categoryId) {
        console.warn(`Unknown category "${categorySlug}" for ${filename}, skipping.`);
        continue;
      }

      const filePath = join(source.dir, filename);
      const fileBuffer = await readFile(filePath);
      const storagePath = `${categorySlug}/${randomUUID()}-${safeName(filename)}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, fileBuffer, { contentType: "application/pdf" });
      if (uploadError) {
        console.error(`Upload failed for ${filename}: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from("documents").getPublicUrl(storagePath);

      const { error: insertError } = await supabase.from("documents").insert({
        title,
        document_number: null,
        category_id: categoryId,
        signed_date: null, // DB trigger defaults it to uploaded_date; admin corrects during review
        status: "draft",
        file_url: publicUrlData.publicUrl,
      });
      if (insertError) {
        console.error(`Insert failed for ${filename}: ${insertError.message}`);
        continue;
      }

      console.log(`Imported: ${title} -> ${categorySlug}`);
      imported++;
    }
  }

  console.log(`\nDone. Imported ${imported}, skipped ${skipped} (already present).`);
  console.log("All imported rows are DRAFT — review signed_date/category/document_number in /admin/documents before publishing.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
