"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Recipient {
  name: string;
  phone: string;
  email: string;
  status: "pending" | "sent" | "failed" | "responded";
  sentAt: string | null;
  respondedAt: string | null;
  responseText: string;
}

interface Broadcast {
  _id: string;
  message: string;
  link: string;
  sentAt: string;
  recipientCount: number;
  deliveredCount: number;
  respondedCount: number;
  recipients: Recipient[];
  createdBy: string;
}

export default function SJSCSendPage() {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState<{ current: number; total: number; currentName: string } | null>(null);
  const [activeBroadcastId, setActiveBroadcastId] = useState<string | null>(null);
  const [recipientCount, setRecipientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load broadcasts and recipient count on mount
  useEffect(() => {
    loadBroadcasts();
    loadRecipientCount();
  }, []);

  // Poll for updates when sending
  useEffect(() => {
    if (!activeBroadcastId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/sjsc/send/${activeBroadcastId}`);
        if (response.ok) {
          const broadcast = await response.json();
          
          // Update the broadcast in our list
          setBroadcasts(prev => prev.map(b => b._id === activeBroadcastId ? broadcast : b));
          
          // Update progress
          const sentCount = broadcast.recipients.filter((r: Recipient) => r.status === "sent" || r.status === "failed").length;
          const currentSending = broadcast.recipients.find((r: Recipient) => r.status === "pending");
          
          setSendingProgress({
            current: sentCount,
            total: broadcast.recipientCount,
            currentName: currentSending?.name || "Complete"
          });

          // Check if sending is complete
          if (sentCount >= broadcast.recipientCount) {
            setActiveBroadcastId(null);
            setSending(false);
            setSendingProgress(null);
          }
        }
      } catch (error) {
        console.error("Error polling broadcast status:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBroadcastId]);

  const loadBroadcasts = async () => {
    try {
      const response = await fetch("/api/sjsc/send");
      if (response.ok) {
        const data = await response.json();
        setBroadcasts(data);
      }
    } catch (error) {
      console.error("Error loading broadcasts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipientCount = async () => {
    try {
      const response = await fetch("/api/sjsc/recipients");
      if (response.ok) {
        const data = await response.json();
        setRecipientCount(data.count);
      }
    } catch (error) {
      console.error("Error loading recipient count:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const response = await fetch("/api/sjsc/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, link })
      });

      if (response.ok) {
        const result = await response.json();
        setActiveBroadcastId(result.id);
        setSendingProgress({ current: 0, total: result.recipientCount, currentName: "Starting..." });
        setMessage("");
        setLink("");
        loadBroadcasts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error sending broadcast:", error);
      alert("Failed to send broadcast");
    }
    
    if (!activeBroadcastId) {
      setSending(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const maskPhone = (phone: string) => {
    if (phone.length < 4) return phone;
    return "***" + phone.slice(-4);
  };

  const previewMessage = () => {
    if (!message.trim()) return "";
    let preview = message;
    if (link.trim()) {
      preview += "\n\n" + link;
    }
    return preview;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "#25D366";
      case "failed": return "#ff4444";
      case "responded": return "#D4A843";
      case "pending": return "#666";
      default: return "#666";
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#0a0a0a", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#0a0a0a", 
      color: "#fff", 
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <Link 
          href="/todo" 
          style={{ 
            color: "#666", 
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "10px",
            display: "inline-block"
          }}
        >
          ← Back to Vault
        </Link>
        <h1 style={{ color: "#FF8900", fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0" }}>
          SJSC Send
        </h1>
        <p style={{ color: "#888", margin: 0 }}>WhatsApp Broadcast to SJSC Deck Requests</p>
      </div>

      {/* Message Composer */}
      <div style={{ 
        background: "#111", 
        border: "1px solid #333", 
        borderRadius: "8px", 
        padding: "20px", 
        marginBottom: "30px" 
      }}>
        <h3 style={{ color: "#FF8900", marginTop: 0, marginBottom: "20px" }}>Compose Message</h3>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", color: "#ccc", marginBottom: "8px", fontSize: "14px" }}>
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your WhatsApp message..."
            style={{
              width: "100%",
              height: "120px",
              background: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "12px",
              color: "#fff",
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", color: "#ccc", marginBottom: "8px", fontSize: "14px" }}>
            Link (optional)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            style={{
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "12px",
              color: "#fff",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Preview */}
        {message.trim() && (
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#ccc", marginBottom: "8px", fontSize: "14px" }}>
              Preview
            </label>
            <div style={{
              background: "#1a1a1a",
              border: "1px solid #444",
              borderRadius: "6px",
              padding: "12px",
              color: "#ddd",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              fontFamily: "inherit"
            }}>
              {previewMessage()}
            </div>
          </div>
        )}

        {/* Recipient Count */}
        <div style={{ marginBottom: "20px", color: "#888", fontSize: "14px" }}>
          This will be sent to <strong style={{ color: "#FF8900" }}>{recipientCount}</strong> contacts
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          style={{
            background: sending ? "#666" : "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "15px 30px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: sending ? "not-allowed" : "pointer",
            opacity: sending ? 0.7 : 1,
            marginBottom: "10px"
          }}
        >
          {sending ? "SENDING..." : "SEND TO ALL"}
        </button>

        <div style={{ color: "#888", fontSize: "13px" }}>
          ⚠️ Messages will be sent slowly (10-15 second delays) to protect your account
        </div>
      </div>

      {/* Progress Panel */}
      {sendingProgress && (
        <div style={{
          background: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "30px"
        }}>
          <h3 style={{ color: "#FF8900", marginTop: 0, marginBottom: "15px" }}>Sending Progress</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <div style={{
              background: "#333",
              borderRadius: "10px",
              height: "20px",
              overflow: "hidden"
            }}>
              <div style={{
                background: "#25D366",
                height: "100%",
                width: `${(sendingProgress.current / sendingProgress.total) * 100}%`,
                transition: "width 0.5s ease"
              }} />
            </div>
          </div>

          <div style={{ color: "#ccc", fontSize: "14px" }}>
            Sending to <strong>{sendingProgress.currentName}</strong>... ({sendingProgress.current} of {sendingProgress.total})
          </div>
        </div>
      )}

      {/* Send History */}
      <div style={{ 
        background: "#111", 
        border: "1px solid #333", 
        borderRadius: "8px", 
        padding: "20px" 
      }}>
        <h3 style={{ color: "#FF8900", marginTop: 0, marginBottom: "20px" }}>Send History</h3>
        
        {broadcasts.length === 0 ? (
          <div style={{ color: "#666", fontSize: "14px" }}>No broadcasts sent yet.</div>
        ) : (
          broadcasts.map(broadcast => (
            <div key={broadcast._id} style={{ marginBottom: "15px" }}>
              <div 
                onClick={() => toggleExpanded(broadcast._id)}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  padding: "15px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#ccc", fontSize: "14px", marginBottom: "5px" }}>
                      {formatDate(broadcast.sentAt)}
                    </div>
                    <div style={{ color: "#fff", fontSize: "15px", marginBottom: "8px" }}>
                      {broadcast.message.length > 100 
                        ? broadcast.message.substring(0, 100) + "..." 
                        : broadcast.message}
                    </div>
                  </div>
                  <div style={{ color: expandedId === broadcast._id ? "#FF8900" : "#666" }}>
                    {expandedId === broadcast._id ? "▼" : "▶"}
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "20px", fontSize: "13px" }}>
                  <span style={{ color: "#888" }}>
                    <strong>{broadcast.recipientCount}</strong> recipients
                  </span>
                  <span style={{ color: "#25D366" }}>
                    <strong>{broadcast.deliveredCount}</strong> sent
                  </span>
                  <span style={{ color: "#ff4444" }}>
                    <strong>{broadcast.recipientCount - broadcast.deliveredCount}</strong> failed
                  </span>
                  <span style={{ color: "#D4A843" }}>
                    <strong>{broadcast.respondedCount}</strong> responded
                  </span>
                </div>
              </div>

              {/* Expanded View */}
              {expandedId === broadcast._id && broadcast.recipients && (
                <div style={{
                  background: "#0d0d0d",
                  border: "1px solid #333",
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  padding: "15px"
                }}>
                  <h4 style={{ color: "#FF8900", marginTop: 0, marginBottom: "15px" }}>Delivery Report</h4>
                  
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {broadcast.recipients.map((recipient, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: idx < broadcast.recipients.length - 1 ? "1px solid #222" : "none",
                          fontSize: "14px"
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ color: "#fff", fontWeight: 500 }}>{recipient.name}</span>
                          <span style={{ color: "#666", marginLeft: "10px" }}>
                            {maskPhone(recipient.phone)}
                          </span>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <span style={{ color: getStatusColor(recipient.status), fontWeight: 600 }}>
                            {recipient.status.toUpperCase()}
                          </span>
                          
                          {recipient.sentAt && (
                            <span style={{ color: "#888", fontSize: "12px" }}>
                              {formatDate(recipient.sentAt)}
                            </span>
                          )}
                          
                          {recipient.responseText && (
                            <span style={{ 
                              color: "#D4A843", 
                              fontSize: "12px",
                              maxWidth: "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}>
                              "{recipient.responseText}"
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}