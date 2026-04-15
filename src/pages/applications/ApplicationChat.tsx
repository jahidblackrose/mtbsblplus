import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageComponents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, Paperclip, FileText, X, Download, User, Headset, CheckCheck } from "lucide-react";
import { ChatMessage, validateFile } from "@/api/chatApi";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Demo messages for preview (replace with API calls)
const generateDemoMessages = (appId: string): ChatMessage[] => [
  { id: "1", applicationId: appId, senderType: "user", senderName: "Md. Rahman", message: "I have submitted all the required documents for my SBL application.", isRead: true, createdAt: "2026-04-10T09:15:00Z" },
  { id: "2", applicationId: appId, senderType: "backoffice", senderName: "CRM Officer", message: "Thank you, Mr. Rahman. We have received your documents. We are currently reviewing your CIF details.", isRead: true, createdAt: "2026-04-10T09:22:00Z" },
  { id: "3", applicationId: appId, senderType: "user", senderName: "Md. Rahman", message: "Please let me know if anything else is needed.", isRead: true, createdAt: "2026-04-10T09:30:00Z" },
  { id: "4", applicationId: appId, senderType: "backoffice", senderName: "CRM Officer", message: "We need an updated trade license. Please upload a scanned copy.", isRead: true, createdAt: "2026-04-10T10:05:00Z" },
  { id: "5", applicationId: appId, senderType: "user", senderName: "Md. Rahman", message: "Here is the updated trade license.", filePath: "/files/trade-license.pdf", fileName: "trade-license.pdf", fileSize: 1240000, isRead: true, createdAt: "2026-04-10T10:45:00Z" },
  { id: "6", applicationId: appId, senderType: "backoffice", senderName: "CRM Officer", message: "Received. Your application is now moved to CIB verification stage.", isRead: false, createdAt: "2026-04-10T11:00:00Z" },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function groupByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let current = "";
  for (const m of messages) {
    const d = formatDate(m.createdAt);
    if (d !== current) {
      current = d;
      groups.push({ date: d, messages: [m] });
    } else {
      groups[groups.length - 1].messages.push(m);
    }
  }
  return groups;
}

export default function ApplicationChat() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (id) {
      const msgs = generateDemoMessages(id);
      setMessages(msgs);
      // Mark all as read on open (replace with API: markAsRead(id))
      // markAsRead(id);
    }
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { toast.error(err); return; }
    setFile(f);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed && !file) return;
    setSending(true);

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      applicationId: id || "",
      senderType: "user",
      senderName: user?.displayName || user?.username || "You",
      message: trimmed,
      filePath: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
      fileSize: file?.size,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSending(false);
  }, [text, file, id, user]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const dateGroups = groupByDate(messages);

  return (
    <AppLayout>
      <PageHeader
        title={`Chat — ${id || "Application"}`}
        subtitle="Communicate with Back Office"
      >
        <Link to="/applications">
          <Button variant="outline" size="sm"><ArrowLeft className="mr-1 h-3.5 w-3.5" />Back</Button>
        </Link>
      </PageHeader>

      <div className="card-compact flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
        {/* Chat header bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-muted/30">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              <Headset className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[length:var(--font-size-base)] font-medium leading-none">Back Office — CRM</p>
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground mt-0.5">Application: {id}</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-[hsl(var(--muted)/0.15)] px-4 py-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.chat-scroll::-webkit-scrollbar{display:none}`}</style>
          <div className="chat-scroll max-w-3xl mx-auto space-y-4">
            {dateGroups.map((group) => (
              <div key={group.date}>
                <div className="flex justify-center my-3">
                  <span className="bg-muted text-muted-foreground text-[length:var(--font-size-xs)] px-3 py-0.5 rounded-full">{group.date}</span>
                </div>
                <div className="space-y-2">
                  {group.messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* File preview */}
        {file && (
          <div className="flex items-center gap-2 px-4 py-1.5 border-t border-border bg-muted/30">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-[length:var(--font-size-sm)] truncate flex-1">{file.name} ({formatFileSize(file.size)})</span>
            <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border">
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileSelect} />
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()} title="Attach file (max 5 MB)">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button size="icon" disabled={sending || (!text.trim() && !file)} onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function MessageBubble({ message: m }: { message: ChatMessage }) {
  const isUser = m.senderType === "user";
  return (
    <div className={cn("flex", isUser ? "justify-start" : "justify-end")}>
      <div className={cn(
        "max-w-[75%] rounded-lg px-3 py-2 shadow-sm",
        isUser ? "bg-background border border-border rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
      )}>
        <p className={cn("text-[length:var(--font-size-xs)] font-semibold mb-0.5", isUser ? "text-primary" : "text-primary-foreground/80")}>
          {isUser ? <User className="inline h-3 w-3 mr-1 -mt-0.5" /> : <Headset className="inline h-3 w-3 mr-1 -mt-0.5" />}
          {m.senderName}
        </p>
        {m.message && <p className="text-[length:var(--font-size-sm)] leading-relaxed whitespace-pre-wrap">{m.message}</p>}
        {m.fileName && (
          <a href={m.filePath} target="_blank" rel="noopener noreferrer" className={cn(
            "flex items-center gap-1.5 mt-1.5 p-1.5 rounded text-[length:var(--font-size-xs)]",
            isUser ? "bg-muted hover:bg-muted/80" : "bg-primary-foreground/10 hover:bg-primary-foreground/20"
          )}>
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate flex-1">{m.fileName}</span>
            {m.fileSize && <span className="shrink-0">{formatFileSize(m.fileSize)}</span>}
            <Download className="h-3.5 w-3.5 shrink-0" />
          </a>
        )}
        <div className={cn("flex items-center gap-1 mt-1 justify-end", isUser ? "text-muted-foreground" : "text-primary-foreground/60")}>
          <span className="text-[10px]">{formatTime(m.createdAt)}</span>
          {isUser && (
            <CheckCheck className={cn("h-3 w-3", m.isRead ? "text-blue-500" : "opacity-50")} />
          )}
        </div>
      </div>
    </div>
  );
}
