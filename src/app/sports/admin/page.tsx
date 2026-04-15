"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  createdAt: string;
  lastLogin: string;
  role?: string;
}

interface Pick {
  _id: string;
  game: string;
  pick: string;
  sport: string;
  confidence: string;
  notes: string;
  createdAt: string;
  published: boolean;
  premium?: boolean;
}

export default function SportsAdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "picks" | "revenue">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPick, setShowAddPick] = useState(false);
  const [showEditUser, setShowEditUser] = useState<User | null>(null);
  
  const [pickForm, setPickForm] = useState({
    game: "",
    sport: "NCAAB",
    pick: "",
    confidence: "medium",
    notes: "",
    premium: false
  });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const res = await fetch("/api/sports/auth/me");
      const data = await res.json();
      
      if (!res.ok || data.user?.role !== "admin") {
        window.location.href = "/sports/login";
        return;
      }
      
      loadUsers();
      loadPicks();
    } catch (error) {
      window.location.href = "/sports/login";
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // This would be a dedicated admin API route
      const res = await fetch("/api/sports/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadPicks = async () => {
    try {
      // This would be a dedicated admin API route  
      const res = await fetch("/api/sports/admin/picks");
      if (res.ok) {
        const data = await res.json();
        setPicks(data.picks || []);
      }
    } catch (error) {
      setError("Failed to load picks");
    }
  };

  const updateUserCredits = async (userId: string, credits: number, action: "set" | "add" | "subtract") => {
    try {
      const res = await fetch("/api/sports/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits, action })
      });

      if (res.ok) {
        loadUsers(); // Reload to show updated credits
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update credits");
      }
    } catch (error) {
      setError("Failed to update credits");
    }
  };

  const updateUserPlan = async (userId: string, plan: string) => {
    try {
      const res = await fetch("/api/sports/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan })
      });

      if (res.ok) {
        loadUsers();
      } else {
        setError("Failed to update plan");
      }
    } catch (error) {
      setError("Failed to update plan");
    }
  };

  const createPick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/sports/admin/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pickForm)
      });

      if (res.ok) {
        setPickForm({
          game: "",
          sport: "NCAAB", 
          pick: "",
          confidence: "medium",
          notes: "",
          premium: false
        });
        setShowAddPick(false);
        loadPicks();
      } else {
        setError("Failed to create pick");
      }
    } catch (error) {
      setError("Failed to create pick");
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Plan", "Credits", "Signup Date", "Last Login"].join(","),
      ...users.map(u => [
        u.name,
        u.email,
        u.plan,
        u.credits,
        new Date(u.createdAt).toLocaleDateString(),
        new Date(u.lastLogin).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sports-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const totalRevenue = users.reduce((sum, user) => {
    const planPrices = { free: 0, starter: 49, pro: 199, elite: 499, unlimited: 999 };
    return sum + (planPrices[user.plan as keyof typeof planPrices] || 0);
  }, 0);

  const planCounts = users.reduce((counts, user) => {
    counts[user.plan] = (counts[user.plan] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8900]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-bold">ADMIN</span>
            </div>
            <h1 className="text-2xl font-black">Sports Intelligence Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/sports/dashboard" className="text-gray-400 hover:text-white text-sm">
              ← Dashboard
            </a>
            <a href="/sports" className="text-gray-400 hover:text-white text-sm">
              Public View
            </a>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-white/10 px-4">
        <div className="max-w-7xl mx-auto flex gap-1">
          {[
            { key: "users", label: "Users" },
            { key: "picks", label: "Picks" },
            { key: "revenue", label: "Revenue" }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "text-[#FF8900] border-b-2 border-[#FF8900]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">User Management</h2>
              <button
                onClick={exportUsers}
                className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                Export CSV
              </button>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a1a1a] border-b border-white/10">
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">User</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Plan</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium">Credits</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium">Signup</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium">Last Login</th>
                      <th className="text-center px-4 py-3 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-xs">{user.email}</div>
                            {user.role === "admin" && (
                              <span className="bg-red-500/20 text-red-400 text-xs px-1 py-0.5 rounded">ADMIN</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.plan}
                            onChange={(e) => updateUserPlan(user._id, e.target.value)}
                            className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-white text-xs"
                          >
                            <option value="free">Free</option>
                            <option value="starter">Starter</option>
                            <option value="pro">Pro</option>
                            <option value="elite">Elite</option>
                            <option value="unlimited">Unlimited</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[#FF8900] font-mono font-bold">{user.credits}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => updateUserCredits(user._id, 100, "add")}
                                className="bg-green-500/20 text-green-400 text-xs px-1 py-0.5 rounded hover:bg-green-500/30"
                                title="Add 100"
                              >
                                +
                              </button>
                              <button
                                onClick={() => updateUserCredits(user._id, 100, "subtract")}
                                className="bg-red-500/20 text-red-400 text-xs px-1 py-0.5 rounded hover:bg-red-500/30"
                                title="Remove 100"
                              >
                                -
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-400 text-xs">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setShowEditUser(user)}
                            className="text-[#FF8900] text-xs hover:underline"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Picks Tab */}
        {activeTab === "picks" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Pick Management</h2>
              <button
                onClick={() => setShowAddPick(true)}
                className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 transition-all"
              >
                Create Pick
              </button>
            </div>

            <div className="space-y-4">
              {picks.map((pick) => (
                <div key={pick._id} className="bg-[#111] border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#FF8900]/20 text-[#FF8900] text-xs font-bold px-2 py-1 rounded">
                          {pick.sport}
                        </span>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          pick.confidence === "high" 
                            ? "bg-green-500/20 text-green-400" 
                            : pick.confidence === "medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {pick.confidence}
                        </span>
                        {pick.premium && (
                          <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">
                            PREMIUM
                          </span>
                        )}
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          pick.published 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {pick.published ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{pick.game}</h3>
                      <p className="text-[#FF8900] font-bold mb-2">{pick.pick}</p>
                      {pick.notes && (
                        <p className="text-gray-400 text-sm">{pick.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button className="bg-white/10 text-white px-3 py-1 rounded text-xs hover:bg-white/20 transition-colors">
                        Edit
                      </button>
                      <button className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-xs hover:bg-red-500/30 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-gray-500 text-xs">
                    Created: {new Date(pick.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}

              {picks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No picks created yet. Create your first pick to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div>
            <h2 className="text-2xl font-black mb-6">Revenue Overview</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#111] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-green-400 text-3xl font-black mb-2">${totalRevenue.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Monthly Revenue</div>
              </div>
              
              <div className="bg-[#111] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-[#FF8900] text-3xl font-black mb-2">{users.length}</div>
                <div className="text-gray-400 text-sm">Total Users</div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-blue-400 text-3xl font-black mb-2">{planCounts.pro || 0}</div>
                <div className="text-gray-400 text-sm">Pro Subscribers</div>
              </div>

              <div className="bg-[#111] border border-white/10 rounded-xl p-6 text-center">
                <div className="text-purple-400 text-3xl font-black mb-2">{(planCounts.unlimited || 0) + (planCounts.elite || 0)}</div>
                <div className="text-gray-400 text-sm">Premium Users</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Plan Distribution</h3>
              <div className="space-y-3">
                {Object.entries(planCounts).map(([plan, count]) => {
                  const percentage = (count / users.length) * 100;
                  return (
                    <div key={plan} className="flex items-center gap-4">
                      <span className="capitalize text-white font-medium w-20">{plan}</span>
                      <div className="flex-1 relative h-6 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF8900] to-[#DC2626] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-2">
                          <span className="text-xs font-bold text-white drop-shadow">
                            {count} users ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Pick Modal */}
      {showAddPick && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-white mb-6">Create New Pick</h3>
            <form onSubmit={createPick} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Sport</label>
                  <select
                    value={pickForm.sport}
                    onChange={(e) => setPickForm({ ...pickForm, sport: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="NCAAB">NCAAB</option>
                    <option value="NFL">NFL</option>
                    <option value="NBA">NBA</option>
                    <option value="MLB">MLB</option>
                    <option value="NHL">NHL</option>
                    <option value="UFC">UFC</option>
                    <option value="Soccer">Soccer</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Confidence</label>
                  <select
                    value={pickForm.confidence}
                    onChange={(e) => setPickForm({ ...pickForm, confidence: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm block mb-2">Game</label>
                <input
                  type="text"
                  required
                  value={pickForm.game}
                  onChange={(e) => setPickForm({ ...pickForm, game: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., Duke vs Michigan State"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Pick</label>
                <input
                  type="text"
                  required
                  value={pickForm.pick}
                  onChange={(e) => setPickForm({ ...pickForm, pick: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white"
                  placeholder="e.g., Duke -4.5, Over 140.5"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Analysis Notes</label>
                <textarea
                  value={pickForm.notes}
                  onChange={(e) => setPickForm({ ...pickForm, notes: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white h-24"
                  placeholder="Analysis, reasoning, key factors..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="premium"
                  checked={pickForm.premium}
                  onChange={(e) => setPickForm({ ...pickForm, premium: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="premium" className="text-white text-sm">Premium Pick (Pro+ only)</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  Create & Publish Pick
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPick(false)}
                  className="px-6 bg-[#1a1a1a] text-gray-400 font-bold py-3 rounded-xl hover:text-white transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}