import fs from "node:fs/promises";
import path from "node:path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

let writeQueue: Promise<void> = Promise.resolve();

export async function getAllInquiries(): Promise<InquiryRecord[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as InquiryRecord[]) : [];
  } catch {
    return [];
  }
}

export async function saveAllInquiries(list: InquiryRecord[]): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpPath = `${INQUIRIES_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(list, null, 2), "utf-8");
    await fs.rename(tmpPath, INQUIRIES_FILE);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

export async function addInquiry(record: InquiryRecord): Promise<InquiryRecord[]> {
  const list = await getAllInquiries();
  const next = [record, ...list];
  await saveAllInquiries(next);
  return next;
}

export async function deleteInquiryById(id: string): Promise<InquiryRecord[]> {
  const list = await getAllInquiries();
  const next = list.filter((item) => item.id !== id);
  await saveAllInquiries(next);
  return next;
}
