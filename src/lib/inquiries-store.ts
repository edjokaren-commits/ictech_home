import { getSupabaseAdmin } from "@/lib/supabase";

export interface InquiryRecord {
  id: string;
  createdAt: string;
  inquiryType: "quote" | "custom" | "support";
  inquiryTypeLabel: string;
  productModel: string;
  quantity: string;
  selectedReqs: string[];
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  message: string;
  recipient: string;
  emailStatus: "sent" | "failed" | "not_configured";
  emailProvider?: string;
  emailError?: string;
}

export async function getAllInquiries(): Promise<InquiryRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("data, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => row.data as InquiryRecord);
  } catch (err) {
    console.error("getAllInquiries error:", err);
    return [];
  }
}

export async function saveAllInquiries(list: InquiryRecord[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  if (list.length === 0) {
    await supabase.from("inquiries").delete().neq("id", "");
    return;
  }

  const rows = list.map((item) => ({
    id: item.id,
    data: item,
    created_at: item.createdAt || new Date().toISOString(),
  }));
  const { error } = await supabase.from("inquiries").upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

export async function addInquiry(record: InquiryRecord): Promise<InquiryRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [record];

  const { error } = await supabase.from("inquiries").upsert(
    {
      id: record.id,
      data: record,
      created_at: record.createdAt || new Date().toISOString(),
    },
    { onConflict: "id" }
  );
  if (error) throw error;

  return getAllInquiries();
}

export async function deleteInquiryById(id: string): Promise<InquiryRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw error;

  return getAllInquiries();
}