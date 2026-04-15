"use client";

const tools = [
  { name: "Jeff Cline Agency Dashboard", url: "https://jeff-cline.com/dashboard" },
  { name: "el.ag", url: "https://el.ag" },
  { name: "MultiFamilyOffice.ai", url: "https://multifamilyoffice.ai" },
  { name: "VoiceDrips.com", url: "https://voicedrips.com" },
  { name: "KeywordCalls.com", url: "https://keywordcalls.com" },
  { name: "MoneyWords.org", url: "https://moneywords.org" },
  { name: "agents.biz", url: "https://agents.biz" },
  { name: "executive.krystalore.com", url: "https://executive.krystalore.com" },
];

export default function ToolsPanel() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#FF8900", marginBottom: 20 }}>Tools & Project Logins</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {tools.map(t => (
          <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: "16px 20px", textDecoration: "none", transition: "border-color 0.2s" }}
            onMouseOver={e => (e.currentTarget.style.borderColor = "#FF8900")}
            onMouseOut={e => (e.currentTarget.style.borderColor = "#222")}
          >
            <div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 15 }}>{t.name}</div>
            <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{t.url}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
