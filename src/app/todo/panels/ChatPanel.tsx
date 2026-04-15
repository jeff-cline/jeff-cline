"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface User { name: string; email: string; role: string; userId: string }
interface Channel { id: string; name: string; position: number }
interface DiscordAuthor { id: string; username: string; avatar: string | null; bot?: boolean }
interface DiscordMessage {
  id: string;
  content: string;
  author: DiscordAuthor;
  timestamp: string;
  edited_timestamp: string | null;
}

const BOT_APP_ID = "1470158589887905863";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function avatarUrl(author: DiscordAuthor): string {
  if (author.avatar) return `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=64`;
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(author.id) % 5}.png`;
}

export default function ChatPanel({ user, initialChannelId }: { user: User; initialChannelId?: string }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>(initialChannelId || "");
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldScrollRef = useRef(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load channels
  useEffect(() => {
    fetch("/api/todo/discord/channels").then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setChannels(d);
        if (!selectedChannel && d.length > 0) setSelectedChannel(d[0].id);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update channel when initialChannelId changes from sidebar
  useEffect(() => {
    if (initialChannelId && initialChannelId !== selectedChannel) {
      setSelectedChannel(initialChannelId);
    }
  }, [initialChannelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMessages = useCallback(async (channelId: string, after?: string) => {
    const params = new URLSearchParams({ channelId });
    if (after) params.set("after", after);
    const res = await fetch(`/api/todo/discord/messages?${params}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, []);

  // Load messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    setLoading(true);
    setMessages([]);
    setHasMore(true);
    shouldScrollRef.current = true;
    fetchMessages(selectedChannel).then(msgs => {
      // Discord returns newest first, reverse for chat order
      setMessages(msgs.reverse());
      setLoading(false);
    });
  }, [selectedChannel, fetchMessages]);

  // Auto-scroll
  useEffect(() => {
    if (shouldScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Poll for new messages every 5s
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!selectedChannel) return;
    pollRef.current = setInterval(async () => {
      if (messages.length === 0) return;
      const newest = messages[messages.length - 1];
      const newMsgs = await fetchMessages(selectedChannel, newest.id);
      if (newMsgs.length > 0) {
        shouldScrollRef.current = true;
        setMessages(prev => [...prev, ...newMsgs.reverse()]);
      }
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedChannel, messages, fetchMessages]);

  // Load older messages on scroll up
  const handleScroll = async () => {
    if (!listRef.current || loadingMore || !hasMore || messages.length === 0) return;
    if (listRef.current.scrollTop < 100) {
      setLoadingMore(true);
      shouldScrollRef.current = false;
      const oldest = messages[0];
      const params = new URLSearchParams({ channelId: selectedChannel, before: oldest.id });
      const res = await fetch(`/api/todo/discord/messages?${params}`);
      const older = await res.json();
      if (Array.isArray(older) && older.length > 0) {
        setMessages(prev => [...older.reverse(), ...prev]);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !attachedFile) || !selectedChannel || sending) return;
    const text = input.trim();
    const file = attachedFile;
    setSending(true);
    setInput("");
    setAttachedFile(null);
    shouldScrollRef.current = true;

    // Optimistic display
    const tempId = `temp-${Date.now()}`;
    const displayText = file
      ? `**[${user.name}]** ${text || `[Uploaded: ${file.name}]`}`
      : `**[${user.name}]** ${text}`;
    const optimistic: DiscordMessage = {
      id: tempId,
      content: displayText,
      author: { id: BOT_APP_ID, username: user.name, avatar: null, bot: true },
      timestamp: new Date().toISOString(),
      edited_timestamp: null,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      let res: Response;

      if (file) {
        // Use upload endpoint for files
        const formData = new FormData();
        formData.append("channelId", selectedChannel);
        formData.append("file", file);
        if (text) formData.append("message", text);
        res = await fetch("/api/todo/discord/upload", { method: "POST", body: formData });
      } else {
        res = await fetch("/api/todo/discord/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelId: selectedChannel, content: text }),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Send failed" }));
        setMessages(prev => prev.map(m => m.id === tempId
          ? { ...m, content: `[FAILED] ${text || file?.name || ""} — ${err.error || "Send failed. Try again."}` }
          : m
        ));
        setSending(false);
        return;
      }

      const msg = await res.json();
      setMessages(prev => prev.map(m => m.id === tempId ? { ...msg, id: msg.id } : m));

      // Fetch any other new messages
      await new Promise(r => setTimeout(r, 500));
      const params = new URLSearchParams({ channelId: selectedChannel, after: msg.id });
      const poll = await fetch(`/api/todo/discord/messages?${params}`);
      const newMsgs = await poll.json();
      if (Array.isArray(newMsgs) && newMsgs.length > 0) {
        setMessages(prev => [...prev, ...newMsgs.reverse()]);
      }
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === tempId
        ? { ...m, content: `[FAILED] ${text || file?.name || ""} — Network error. Try again.` }
        : m
      ));
    }
    setSending(false);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setAttachedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  };

  const isBot = (author: DiscordAuthor) => author.id === BOT_APP_ID || author.bot;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0a0a0a" }}>
      {/* Channel selector */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#FF8900", fontWeight: 700, fontSize: 16 }}>CHAT</span>
        <select
          value={selectedChannel}
          onChange={e => setSelectedChannel(e.target.value)}
          style={{
            flex: 1, maxWidth: 260, padding: "8px 12px", background: "#1a1a1a",
            border: "1px solid #333", borderRadius: 6, color: "#f0f0f0", fontSize: 14,
          }}
        >
          {channels.map(c => (
            <option key={c.id} value={c.id}>#{c.name}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        onScroll={handleScroll}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        style={{
          flex: 1, overflow: "auto", padding: "8px 16px",
          border: dragOver ? "2px dashed #FF8900" : "2px solid transparent",
          transition: "border-color 0.2s",
        }}
      >
        {loadingMore && (
          <div style={{ textAlign: "center", padding: 8, color: "#555", fontSize: 12 }}>Loading older messages...</div>
        )}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#555" }}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#555" }}>No messages in this channel.</div>
        ) : (
          messages.map(msg => {
            const bot = isBot(msg.author);
            return (
              <div key={msg.id} style={{
                display: "flex", gap: 10, padding: "8px 0",
                borderBottom: "1px solid #161616",
              }}>
                <img
                  src={avatarUrl(msg.author)}
                  alt=""
                  style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    border: bot ? "2px solid #FF8900" : "2px solid #333",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontWeight: 600, fontSize: 14,
                      color: bot ? "#FF8900" : "#e0e0e0",
                    }}>
                      {bot ? "AIpril" : msg.author.username}
                    </span>
                    {bot && (
                      <span style={{
                        fontSize: 10, padding: "1px 6px", background: "#FF890022",
                        color: "#FF8900", borderRadius: 3, fontWeight: 600,
                      }}>BOT</span>
                    )}
                    <span style={{ color: "#555", fontSize: 11 }}>{relativeTime(msg.timestamp)}</span>
                  </div>
                  <div style={{
                    color: msg.id.startsWith("temp-") ? "#888" : msg.content.startsWith("[FAILED]") ? "#ff4444" : "#ccc",
                    fontSize: 14, marginTop: 2,
                    wordBreak: "break-word", whiteSpace: "pre-wrap",
                    lineHeight: 1.5,
                    fontStyle: msg.id.startsWith("temp-") ? "italic" : "normal",
                  }}>
                    {msg.id.startsWith("temp-") && <span style={{ color: "#FF8900", fontSize: 11, marginRight: 6 }}>Sending...</span>}
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attached file indicator */}
      {attachedFile && (
        <div style={{
          padding: "6px 16px", borderTop: "1px solid #222", background: "#1a1a1a",
          display: "flex", alignItems: "center", gap: 8, fontSize: 13,
        }}>
          <span style={{ color: "#FF8900" }}>Attached:</span>
          <span style={{ color: "#ccc", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
          </span>
          <button
            onClick={() => setAttachedFile(null)}
            style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
          >
            x
          </button>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid #222",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".txt,.md,.csv,.json,.doc,.docx,.pdf,.html,.xml,.rtf,.log,.yml,.yaml,.png,.jpg,.jpeg,.gif,.webp"
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Attach file"
          style={{
            background: "none", border: "1px solid #444", borderRadius: 6,
            color: attachedFile ? "#FF8900" : "#888", cursor: "pointer",
            padding: "8px 10px", fontSize: 16, lineHeight: 1,
            display: "flex", alignItems: "center",
          }}
        >
          +
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={attachedFile ? `Add a note about ${attachedFile.name}...` : `Message #${channels.find(c => c.id === selectedChannel)?.name || "channel"}...`}
          style={{
            flex: 1, padding: "10px 14px", background: "#1a1a1a",
            border: "1px solid #333", borderRadius: 8, color: "#f0f0f0",
            fontSize: 14, outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || (!input.trim() && !attachedFile)}
          style={{
            padding: "10px 20px", background: (sending || (!input.trim() && !attachedFile)) ? "#555" : "#FF8900",
            color: "#000", border: "none", borderRadius: 8,
            fontWeight: 700, cursor: (sending || (!input.trim() && !attachedFile)) ? "default" : "pointer",
            fontSize: 14,
          }}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
