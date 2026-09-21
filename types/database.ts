// Hand-authored to match supabase/migrations/0001_init.sql.
// Regenerate once the real Supabase project exists:
//   npx supabase gen types typescript --project-id <ref> > types/database.ts

export type DocumentStatus = "draft" | "published";

export interface Database {
  public: {
    Tables: {
      document_categories: {
        Row: {
          id: string;
          slug: string;
          label_vi: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          slug: string;
          label_vi: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          label_vi?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          title: string;
          document_number: string | null;
          category_id: string;
          signed_date: string;
          uploaded_date: string;
          version: number;
          status: DocumentStatus;
          file_url: string;
          content: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          document_number?: string | null;
          category_id: string;
          signed_date?: string | null;
          uploaded_date?: string;
          version?: number;
          status?: DocumentStatus;
          file_url: string;
          content?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          document_number?: string | null;
          category_id?: string;
          signed_date?: string | null;
          version?: number;
          status?: DocumentStatus;
          file_url?: string;
          content?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "document_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      staff: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentCategoryRow = Database["public"]["Tables"]["document_categories"]["Row"];
export type StaffRow = Database["public"]["Tables"]["staff"]["Row"];
