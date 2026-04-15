"use client";
import { useState, useEffect } from "react";

interface TeamUser { _id: string; name: string; email: string; role: string; discordChannels?: string[] }
interface DiscordChannel { id: string; name: string }

const S = {
  input: { padding: "8px 10px", background: "#222", border: "1px solid #333", borderRadius: 6, color: "#f0f0f0", fontSize: 13, boxSizing: "border-box" as const },
  btn: { padding: "6px 14px", background: "#FF8900", color: "#000", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 } as React.CSSProperties,
};

export default function AdminPanel() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [msg, setMsg] = useState("");
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[]>([]);
  const [channelMsg, setChannelMsg] = useState("");

  const fetchUsers = () => { fetch("/api/todo/users").then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])); };
  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => {
    fetch("/api/todo/discord/channels").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setDiscordChannels(d);
    });
  }, []);

  const toggleChannel = async (userId: string, channelId: string, current: string[]) => {
    const hasAll = current.includes("*");
    let updated: string[];
    if (channelId === "*") {
      updated = hasAll ? [] : ["*"];
    } else {
      if (hasAll) {
        // switching from all to specific: give them all channels except this one
        updated = discordChannels.map(c => c.id).filter(id => id !== channelId);
      } else if (current.includes(channelId)) {
        updated = current.filter(id => id !== channelId);
      } else {
        updated = [...current, channelId];
      }
    }
    const res = await fetch("/api/todo/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, discordChannels: updated }),
    });
    if (res.ok) { setChannelMsg("Saved!"); fetchUsers(); }
    else setChannelMsg("Error saving");
    setTimeout(() => setChannelMsg(""), 2000);
  };

  const addUser = async () => {
    setMsg("");
    const res = await fetch("/api/todo/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ name: "", email: "", password: "", role: "member" }); fetchUsers(); setMsg("User added!"); }
    else { const d = await res.json(); setMsg(d.error || "Error"); }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/todo/users?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "#FF8900", marginBottom: 20 }}>Admin — Team Members</h2>
      <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px", color: "#ccc", fontSize: 15 }}>Add Team Member</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={S.input} />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={S.input} />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={S.input} />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={S.input}>
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={addUser} style={S.btn}>Add User</button>
        </div>
        {msg && <div style={{ marginTop: 8, color: msg.includes("!") ? "#4ade80" : "#f87171", fontSize: 13 }}>{msg}</div>}
      </div>
      <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8 }}>
        {users.map(u => (
          <div key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #222" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{u.name}</div>
              <div style={{ color: "#888", fontSize: 12 }}>{u.email} • {u.role}</div>
            </div>
            <button onClick={() => deleteUser(u._id)} style={{ background: "#DC262622", color: "#DC2626", border: "1px solid #DC262644", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>Delete</button>
          </div>
        ))}
      </div>

      {/* Discord Channel Access */}
      <h2 style={{ color: "#FF8900", margin: "32px 0 16px" }}>Discord Channel Access</h2>
      {channelMsg && <div style={{ color: "#4ade80", fontSize: 13, marginBottom: 8 }}>{channelMsg}</div>}
      <div style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", color: "#888" }}>User</th>
              <th style={{ padding: "10px 14px", textAlign: "center", color: "#FF8900" }}>All</th>
              {discordChannels.map(c => (
                <th key={c.id} style={{ padding: "10px 14px", textAlign: "center", color: "#888" }}>#{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const perms = u.discordChannels || [];
              const hasAll = perms.includes("*");
              return (
                <tr key={u._id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "10px 14px", color: "#ccc" }}>{u.name}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center" }}>
                    <input type="checkbox" checked={hasAll} onChange={() => toggleChannel(u._id, "*", perms)} />
                  </td>
                  {discordChannels.map(c => (
                    <td key={c.id} style={{ padding: "10px 14px", textAlign: "center" }}>
                      <input type="checkbox" checked={hasAll || perms.includes(c.id)} onChange={() => toggleChannel(u._id, c.id, perms)} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
