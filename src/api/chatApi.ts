import http from "./http";

export interface ChatMessage {
  id: string;
  applicationId: string;
  senderType: "user" | "backoffice";
  senderName: string;
  message: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  applicationId: string;
  senderType: "user" | "backoffice";
  senderName: string;
  message: string;
  file?: File;
}

export interface UnreadCount {
  applicationId: string;
  count: number;
}

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) return "File size must be under 5 MB.";
  if (!ALLOWED_FILE_TYPES.includes(file.type)) return "Unsupported file type. Allowed: PDF, JPG, PNG, DOCX.";
  return null;
}

export async function fetchMessages(applicationId: string, page = 1, limit = 50): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  return http.get(`/chat/${applicationId}`, { params: { page, limit } });
}

export async function sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
  const formData = new FormData();
  formData.append("applicationId", payload.applicationId);
  formData.append("senderType", payload.senderType);
  formData.append("senderName", payload.senderName);
  formData.append("message", payload.message);
  if (payload.file) formData.append("file", payload.file);

  return http.post("/chat/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function downloadFile(filePath: string): Promise<Blob> {
  return http.get(`/chat/file`, { params: { path: filePath }, responseType: "blob" });
}

/** Fetch unread message counts for multiple applications */
export async function fetchUnreadCounts(applicationIds: string[]): Promise<UnreadCount[]> {
  return http.post("/chat/unread-counts", { applicationIds });
}

/** Mark all messages as read for a given application */
export async function markAsRead(applicationId: string): Promise<void> {
  return http.post(`/chat/${applicationId}/mark-read`);
}
