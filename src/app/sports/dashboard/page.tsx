"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  credits: number | string;
}

interface Pick {
  _id: string;
  game: string;
  pick: string;
  sport: string;
  confidence: string;
  notes: string;
  createdAt: string;
  consumed: boolean;
  requiresCredits: boolean;
  premium?: boolean;
}

export default function SportsDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);
  const [picksLoading, setPicksLoading] = useState(false);
  const [error, setError] = useState("");
  const [todayPicksConsumed, setTodayPicksConsumed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(1);
  const [showUpgradeOverlay, setShowUpgradeOverlay] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [pickHistory, setPickHistory] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadPicks();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/sports/auth/me");
      
      if (!res.ok) {
        router.push("/sports/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/sports/login");
    } finally {
      setLoading(false);
    }
  };

  const loadPicks = async () => {
    setPicksLoading(true);
    try {
      const res = await fetch("/api/sports/user-picks");
      const data = await res.json();
      
      if (res.ok) {
        setPicks(data.picks || []);
        setTodayPicksConsumed(data.user?.todayPicksConsumed || 0);
        setDailyLimit(data.user?.dailyLimit || 1);
      } else {
        setError(data.error || "Failed to load picks");
      }
    } catch (error) {
      setError("Failed to load picks");
    } finally {
      setPicksLoading(false);
    }
  };

  const consumePick = async (pickId: string) => {
    try {
      const res = await fetch("/api/sports/user-picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickId })
      });

      const data = await res.json();

      if (res.ok) {
        // Update user credits
        if (user) {
          setUser({ ...user, credits: data.creditsRemaining });
        }
        
        // Refresh picks
        loadPicks();
      } else {
        if (res.status === 402) {
          setShowUpgradeOverlay(true);
        } else {
          setError(data.error || "Failed to consume pick");
        }
      }
    } catch (error) {
      setError("Failed to consume pick");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/sports/auth/me", { method: "DELETE" });
      router.push("/sports/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/sports/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8900] mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const canConsumeMore = user.plan === "unlimited" || todayPicksConsumed < dailyLimit;
  const availablePicks = picks.filter(p => !p.consumed);
  const consumedPicks = picks.filter(p => p.consumed);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 bg-[#FF8900]/10 border border-[#FF8900]/20 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
              <span className="text-[#FF8900] text-xs font-bold">JC SPORTS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-[#FF8900]">
                {user.credits === "unlimited" || user.credits === "∞" 
                  ? "∞ Credits" 
                  : `${user.credits} Credits`}
              </div>
              <div className="text-xs text-gray-400 capitalize">{user.plan} Plan</div>
            </div>
            <button
              onClick={logout}
              className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Credits</div>
            <div className="text-2xl font-black text-[#FF8900]">
              {user.credits === "unlimited" ? "∞" : user.credits}
            </div>
            <div className="text-gray-600 text-xs">{user.plan} plan</div>
          </div>
          
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Today&apos;s Picks</div>
            <div className="text-2xl font-black text-white">
              {todayPicksConsumed}{user.plan !== "unlimited" ? `/${dailyLimit}` : ""}
            </div>
            <div className="text-gray-600 text-xs">consumed today</div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Available</div>
            <div className="text-2xl font-black text-green-400">{availablePicks.length}</div>
            <div className="text-gray-600 text-xs">picks ready</div>
          </div>

          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">History</div>
            <div className="text-2xl font-black text-blue-400">{consumedPicks.length}</div>
            <div className="text-gray-600 text-xs">picks viewed</div>
          </div>
        </div>

        {/* Credit Usage Meter */}
        {user.plan !== "unlimited" && (
          <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold">Credit Usage</h3>
              <span className="text-gray-400 text-sm">
                {todayPicksConsumed}/{dailyLimit} daily picks used
              </span>
            </div>
            <div className="relative h-4 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  todayPicksConsumed >= dailyLimit 
                    ? "bg-red-500" 
                    : todayPicksConsumed / dailyLimit > 0.7 
                    ? "bg-yellow-500" 
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, (todayPicksConsumed / dailyLimit) * 100)}%` }}
              />
            </div>
            {todayPicksConsumed >= dailyLimit && (
              <p className="text-red-400 text-sm mt-2">
                Daily limit reached. <a href="/sports/pricing" className="text-[#FF8900] hover:underline">Upgrade your plan</a> for more picks.
              </p>
            )}
          </div>
        )}

        {/* AI Q&A Section for Unlimited Users */}
        {user.plan === "unlimited" && (
          <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-purple-400 font-bold text-lg mb-4 flex items-center gap-2">
              <span>🤖</span> AI Sports Assistant
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Ask questions about any game, player, or betting strategy. Get instant AI-powered insights.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about any game or betting strategy..."
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
              />
              <button
                onClick={() => setShowAIChat(true)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors"
              >
                Ask AI
              </button>
            </div>
          </div>
        )}

        {/* Today's Picks */}
        <div className="mb-8">
          <h2 className="text-2xl font-black mb-4">Today&apos;s Picks</h2>
          
          {!canConsumeMore && user.plan !== "unlimited" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm">
                You&apos;ve reached your daily pick limit. <a href="/sports/pricing" className="text-white font-bold hover:underline">Upgrade your plan</a> for unlimited access.
              </p>
            </div>
          )}

          {picksLoading ? (
            <div className="text-center py-12 text-gray-500">Loading picks...</div>
          ) : availablePicks.length === 0 ? (
            <div className="bg-[#111] border border-white/10 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🏈</div>
              <h3 className="text-xl font-bold text-white mb-2">No New Picks</h3>
              <p className="text-gray-400">Check back later for fresh picks from our analysts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availablePicks.map((pick) => (
                <div key={pick._id} className="bg-[#111] border border-white/10 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#FF8900]/20 text-[#FF8900] text-xs font-bold px-2 py-1 rounded">
                          {pick.sport}
                        </span>
                        {pick.confidence && (
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            pick.confidence === "high" 
                              ? "bg-green-500/20 text-green-400" 
                              : pick.confidence === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}>
                            {pick.confidence} confidence
                          </span>
                        )}
                        {pick.premium && (
                          <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-2 py-1 rounded">
                            PREMIUM
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{pick.game}</h3>
                      <p className="text-[#FF8900] font-bold">{pick.pick}</p>
                    </div>
                    
                    {pick.requiresCredits ? (
                      <button
                        onClick={() => consumePick(pick._id)}
                        disabled={!canConsumeMore}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                          canConsumeMore
                            ? "bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white hover:opacity-90"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {user.credits === "unlimited" ? "View Pick" : "Use 1 Credit"}
                      </button>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 text-sm font-bold px-4 py-2 rounded-lg">
                        VIEWED
                      </span>
                    )}
                  </div>

                  {!pick.requiresCredits && pick.notes && (
                    <div className="bg-[#1a1a1a] rounded-lg p-4 mt-4">
                      <p className="text-gray-300 text-sm">{pick.notes}</p>
                    </div>
                  )}

                  <div className="text-gray-500 text-xs mt-3">
                    Posted: {new Date(pick.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pick History */}
        {consumedPicks.length > 0 && (
          <div>
            <h2 className="text-2xl font-black mb-4">Pick History</h2>
            <div className="space-y-3">
              {consumedPicks.slice(0, 10).map((pick) => (
                <div key={pick._id} className="bg-[#111]/50 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-gray-500/20 text-gray-400 text-xs font-bold px-2 py-1 rounded">
                          {pick.sport}
                        </span>
                      </div>
                      <div className="text-white font-medium">{pick.game}</div>
                      <div className="text-gray-400 text-sm">{pick.pick}</div>
                    </div>
                    <div className="text-gray-500 text-xs text-right">
                      {new Date(pick.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade CTA */}
        {user.plan === "free" && (
          <div className="mt-12 bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-black mb-4">Ready to Level Up?</h3>
            <p className="text-gray-400 mb-6">
              Upgrade to Pro for unlimited daily picks, SMS delivery, and advanced analytics.
            </p>
            <a
              href="/sports/pricing"
              className="inline-block bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all"
            >
              View Plans
            </a>
          </div>
        )}
      </div>

      {/* Upgrade Overlay */}
      {showUpgradeOverlay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#FF8900]/30 rounded-2xl p-8 max-w-md w-full text-center relative">
            <button
              onClick={() => setShowUpgradeOverlay(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-black text-white mb-4">Upgrade to Continue</h3>
            <p className="text-gray-400 mb-6">
              You&apos;ve used all your credits. Upgrade to Pro for unlimited access to our expert picks.
            </p>
            
            <div className="space-y-3">
              <a
                href="/sports/pricing"
                className="block bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
              >
                View Plans
              </a>
              <button
                onClick={() => setShowUpgradeOverlay(false)}
                className="block w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Placeholder */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full relative">
            <button
              onClick={() => setShowAIChat(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-purple-400 mb-4">🤖 AI Sports Assistant</h3>
            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm">
                <strong>You asked:</strong> {aiQuestion || "No question yet"}
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <p className="text-purple-300 text-sm">
                🚧 AI assistant coming soon! This feature is currently in development. 
                For now, contact our analysts directly at jeff@jeff-cline.com for personalized insights.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}