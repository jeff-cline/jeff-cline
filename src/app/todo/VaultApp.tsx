"use client";
import { useState, useEffect } from "react";
import DashboardPanel from "./panels/DashboardPanel";
import CalendarPanel from "./panels/CalendarPanel";
import ToolsPanel from "./panels/ToolsPanel";
import ReportsPanel from "./panels/ReportsPanel";
import AdminPanel from "./panels/AdminPanel";
import ChatPanel from "./panels/ChatPanel";
import MembersPanel from "./panels/MembersPanel";

interface User { name: string; email: string; role: string; userId: string }
interface Props { user: User; onLogout: () => void }
interface QuickStats { totalVisits: number; totalLeads: number; totalCredits: number }
interface DiscordChannel { id: string; name: string; position: number }

const TOOLS_SECTIONS = [
  { category: "Agency Dashboard", links: [
    { label: "Agency Dashboard", url: "https://jeff-cline.com/dashboard" },
  ]},
  { category: "Directories", links: [
    { label: "SJSC", url: "/sjsc" },
    { label: "HITT List", url: "/sjsc/hitt" },
    { label: "SJSC Send", url: "/sjsc-send" },
  ]},
  { category: "Predictive", links: [
    { label: "el.ag", url: "https://el.ag/admin" },
  ]},
  { category: "Fundraising", links: [
    { label: "MultiFamilyOffice.ai", url: "https://multifamilyoffice.ai/admin" },
    { label: "SoftCircle.AI", url: "https://softcircle.ai" },
  ]},
  { category: "Big Data", links: [
    { label: "MoneyWords", url: "https://moneywords.org" },
  ]},
  { category: "WhiteLabel", links: [
    { label: "Voice Calls", url: "#" },
  ]},
  { category: "Outbound", links: [
    { label: "VoiceDrips", url: "https://voicedrips.com" },
  ]},
  { category: "Agentic Workforce", links: [
    { label: "Agents.biz", url: "https://agents.biz" },
  ]},
];

export default function VaultApp({ user, onLogout }: Props) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [personalChannelId, setPersonalChannelId] = useState<string>("");

  useEffect(() => {
    fetch("/api/todo/stats").then(r => r.json()).then(d => setQuickStats({ totalVisits: d.totalVisits || 0, totalLeads: d.totalLeads || 0, totalCredits: d.totalCredits || 0 })).catch(() => {});
    // Fetch channels - the API already filters by user permissions
    fetch("/api/todo/discord/channels").then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setChannels(d);
        // Find the user's personal channel by matching channel name to user name
        const userName = user.name.toLowerCase();
        const match = d.find((ch: DiscordChannel) => ch.name.toLowerCase() === userName);
        if (match) setPersonalChannelId(match.id);
      }
    }).catch(() => {});
  }, [user.name]);

  const handleLogout = async () => {
    await fetch("/api/todo/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
    onLogout();
  };

  const selectPage = (key: string) => {
    setPage(key);
    setSidebarOpen(false);
  };

  const openChannel = (channelId: string) => {
    setSelectedChannelId(channelId);
    setPage("chat");
    setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        .vault-layout { display: flex; height: 100vh; overflow: hidden; }
        .vault-sidebar {
          width: 240px; background: #0d0d0d; border-right: 1px solid #222;
          display: flex; flex-direction: column; flex-shrink: 0;
          transition: transform 0.2s ease; overflow-y: auto;
        }
        .vault-main { flex: 1; overflow: auto; background: #111; }
        .vault-hamburger { display: none; }
        .vault-overlay { display: none; }
        .vault-section-label { color: #555; font-size: 10px; font-weight: 700; letter-spacing: 2px; padding: 12px 16px 4px; }
        .vault-nav-btn {
          display: block; width: 100%; padding: 10px 16px; background: transparent;
          border: none; color: #aaa; text-align: left; cursor: pointer; font-size: 13px;
          border-left: 3px solid transparent; transition: all 0.15s;
        }
        .vault-nav-btn:hover { color: #FF8900; background: #1a1a1a; }
        .vault-nav-btn.active { color: #FF8900; background: #1a1a1a; border-left-color: #FF8900; font-weight: 600; }
        .vault-channel-btn {
          display: flex; align-items: center; gap: 8; width: 100%; padding: 8px 16px 8px 20px;
          background: transparent; border: none; color: #777; text-align: left; cursor: pointer;
          font-size: 13px; border-left: 3px solid transparent; transition: all 0.15s;
        }
        .vault-channel-btn:hover { color: #FF8900; background: #1a1a1a; }
        .vault-channel-btn.active { color: #FF8900; background: #1a1a1a; border-left-color: #FF8900; font-weight: 600; }
        .vault-channel-hash { color: #555; font-size: 15px; font-weight: 400; }
        .vault-channel-btn.active .vault-channel-hash { color: #FF890088; }
        .vault-tool-link {
          display: block; width: 100%; padding: 8px 16px 8px 20px; background: transparent;
          border: none; color: #777; text-align: left; cursor: pointer; font-size: 13px;
          text-decoration: none; min-height: 36px; line-height: 20px;
        }
        .vault-tool-link:hover { color: #FF8900; background: #1a1a1a; }
        .vault-stats-bar {
          border-top: 1px solid #222; padding: 12px 16px; display: flex; gap: 8px; flex-wrap: wrap;
        }
        .vault-stat-item { flex: 1; min-width: 60px; text-align: center; }
        .vault-stat-num { color: #FF8900; font-size: 16px; font-weight: 700; }
        .vault-stat-lbl { color: #555; font-size: 9px; letter-spacing: 1px; }
        @media (max-width: 768px) {
          .vault-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 200;
            width: 260px; transform: translateX(-100%);
          }
          .vault-sidebar.open { transform: translateX(0); }
          .vault-hamburger {
            display: flex; position: fixed; top: env(safe-area-inset-top, 6px); left: 6px; z-index: 150;
            background: #1a1a1a; border: 1px solid #333; border-radius: 6px;
            padding: 5px 8px; color: #FF8900; font-size: 16px; cursor: pointer;
            align-items: center; gap: 4px;
          }
          .vault-hamburger span { font-size: 11px; font-weight: 700; letter-spacing: 1px; }
          .vault-main { padding-top: 40px; }
          .vault-layout { overflow-x: hidden !important; width: 100vw; max-width: 100vw; }
          .vault-overlay.open {
            display: block; position: fixed; inset: 0; z-index: 190;
            background: rgba(0,0,0,0.6);
          }
          .vault-channel-btn { min-height: 44px; padding: 12px 16px 12px 20px; font-size: 14px; }
          .vault-tool-link { min-height: 44px; padding: 12px 16px 12px 20px; font-size: 14px; }
        }
      `}</style>

      <button className="vault-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰ <span>VAULT</span>
      </button>
      <div className={`vault-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div className="vault-layout">
        <div className={`vault-sidebar ${sidebarOpen ? "open" : ""}`}>
          {/* Header */}
          <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #222" }}>
            <div style={{ color: "#FF8900", fontWeight: 700, fontSize: 18, letterSpacing: 3 }}>THE VAULT</div>
            <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{user.name} ({user.role})</div>
          </div>

          {/* Main nav */}
          <div style={{ padding: "4px 0", borderBottom: "1px solid #222" }}>
            <button className={`vault-nav-btn ${page === "dashboard" ? "active" : ""}`} onClick={() => selectPage("dashboard")}>
              Dashboard
            </button>
            <button className={`vault-nav-btn ${page === "members" ? "active" : ""}`} onClick={() => selectPage("members")}>
              Members
            </button>
            {user.role === "admin" && (
              <button className={`vault-nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => selectPage("admin")}>
                Admin
              </button>
            )}
          </div>

          {/* AIpril Communication */}
          <div style={{ borderBottom: "1px solid #222", padding: "4px 0" }}>
            <button
              className={`vault-nav-btn ${page === "chat" && selectedChannelId === personalChannelId && personalChannelId ? "active" : ""}`}
              onClick={() => {
                if (personalChannelId) {
                  openChannel(personalChannelId);
                } else {
                  alert("No personal channel assigned. Contact an admin.");
                }
              }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ color: "#FF8900", fontSize: 16 }}>◉</span> AIpril
            </button>
          </div>

          {/* Projects / Channels */}
          <div style={{ borderBottom: "1px solid #222" }}>
            <button
              onClick={() => setProjectsOpen(!projectsOpen)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", background: "none", border: "none", cursor: "pointer",
                padding: "12px 16px 8px", color: "#666", fontSize: 11, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase" as const,
              }}
            >
              <span>PROJECTS {channels.length > 0 ? `(${channels.length})` : ""}</span>
              <span style={{ color: "#FF8900", fontSize: 14, transition: "transform 0.2s", transform: projectsOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
            </button>
            {projectsOpen && channels.map(c => (
              <button
                key={c.id}
                className={`vault-channel-btn ${page === "chat" && selectedChannelId === c.id ? "active" : ""}`}
                onClick={() => openChannel(c.id)}
              >
                <span className="vault-channel-hash">#</span>
                {c.name}
              </button>
            ))}
            {projectsOpen && channels.length === 0 && (
              <div style={{ padding: "8px 20px", color: "#444", fontSize: 12 }}>Loading channels...</div>
            )}
          </div>

          {/* Tools & Links */}
          <div style={{ borderBottom: "1px solid #222" }}>
            <div className="vault-section-label">TOOLS</div>
            {TOOLS_SECTIONS.map(s => (
              <div key={s.category}>
                <div style={{ padding: "8px 20px 2px", color: "#FF8900", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" as const }}>{s.category}</div>
                {s.links.map(t => (
                  <a key={t.label} href={t.url} target={t.url === "#" ? undefined : "_blank"} rel="noopener noreferrer" className="vault-tool-link">
                    {t.label} {t.url !== "#" && <span style={{ fontSize: 10 }}>↗</span>}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Quick Stats */}
          {quickStats && (
            <div className="vault-stats-bar">
              <div className="vault-stat-item">
                <div className="vault-stat-num">{quickStats.totalVisits.toLocaleString()}</div>
                <div className="vault-stat-lbl">VISITS</div>
              </div>
              <div className="vault-stat-item">
                <div className="vault-stat-num">{quickStats.totalLeads.toLocaleString()}</div>
                <div className="vault-stat-lbl">LEADS</div>
              </div>
              <div className="vault-stat-item">
                <div className="vault-stat-num">{quickStats.totalCredits.toLocaleString()}</div>
                <div className="vault-stat-lbl">CREDITS</div>
              </div>
            </div>
          )}

          <button onClick={handleLogout} style={{ margin: 12, padding: "10px", background: "#222", border: "1px solid #333", borderRadius: 6, color: "#888", cursor: "pointer", fontSize: 13 }}>
            Logout
          </button>
        </div>

        <div className="vault-main">
          {page === "dashboard" && <DashboardPanel user={user} />}
          {page === "members" && <MembersPanel />}
          {page === "calendar" && <CalendarPanel user={user} />}
          {page === "tools" && <ToolsPanel />}
          {page === "reports" && <ReportsPanel />}
          {page === "chat" && <ChatPanel user={user} initialChannelId={selectedChannelId} />}
          {page === "admin" && <AdminPanel />}
        </div>
      </div>
    </>
  );
}
