"use client";

import { useState, useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Head from "next/head";

/* ========================================================================
   MARCH MADNESS 2026 DATA — LIVE TOURNAMENT
   ======================================================================== */

const MM_TITLE_ODDS = [
  { seed: 1, team: "Arizona", region: "West", odds: "+350", record: "32-2", conf: "Big 12", ticketPct: 8.7, handlePct: 14.4 },
  { seed: 1, team: "Michigan", region: "Midwest", odds: "+375", record: "31-2", conf: "Big Ten", ticketPct: 11.4, handlePct: 14.0 },
  { seed: 1, team: "Duke", region: "East", odds: "+400", record: "32-2", conf: "ACC", ticketPct: 10.0, handlePct: 9.2 },
  { seed: 1, team: "Florida", region: "South", odds: "+650", record: "26-7", conf: "SEC", ticketPct: 5.1, handlePct: 10.6 },
  { seed: 2, team: "Houston", region: "South", odds: "+1000", record: "28-6", conf: "Big 12", ticketPct: 4.8, handlePct: 5.1 },
  { seed: 2, team: "Iowa State", region: "West", odds: "+1200", record: "27-7", conf: "Big 12", ticketPct: 3.2, handlePct: 3.8 },
  { seed: 2, team: "Purdue", region: "Midwest", odds: "+1400", record: "26-8", conf: "Big Ten", ticketPct: 4.1, handlePct: 3.5 },
  { seed: 2, team: "UConn", region: "East", odds: "+1500", record: "29-5", conf: "Big East", ticketPct: 5.5, handlePct: 4.2 },
  { seed: 3, team: "Gonzaga", region: "West", odds: "+2000", record: "30-3", conf: "WCC", ticketPct: 3.0, handlePct: 2.8 },
  { seed: 3, team: "Illinois", region: "East", odds: "+2200", record: "24-8", conf: "Big Ten", ticketPct: 2.1, handlePct: 1.9 },
  { seed: 3, team: "Michigan State", region: "East", odds: "+2500", record: "25-7", conf: "Big Ten", ticketPct: 2.8, handlePct: 2.2 },
  { seed: 3, team: "Virginia", region: "South", odds: "+3000", record: "29-5", conf: "ACC", ticketPct: 1.5, handlePct: 1.1 },
  { seed: 5, team: "St. John's", region: "West", odds: "+2800", record: "28-6", conf: "Big East", ticketPct: 3.3, handlePct: 2.9 },
];

const MM_ROUND2_SAT = [
  { seed1: 9, team1: "Saint Louis", seed2: 1, team2: "Michigan", spread: -12.5, fav: "Michigan", ml1: "+600", ml2: "-900", total: 161.5, time: "12:10 PM ET", location: "Buffalo, NY", bpi: "Michigan by 10 pts (83%)" },
  { seed1: 6, team1: "Louisville", seed2: 3, team2: "Michigan St", spread: -4.5, fav: "Michigan St", ml1: "+160", ml2: "-192", total: 151.5, time: "2:45 PM ET", location: "Buffalo, NY", bpi: "Louisville by 0.2 pts (51%)" },
  { seed1: 9, team1: "TCU", seed2: 1, team2: "Duke", spread: -11.5, fav: "Duke", ml1: "+525", ml2: "-750", total: 140.5, time: "5:15 PM ET", location: "Greenville, SC", bpi: "Duke by 14.5 pts (91%)" },
  { seed1: 10, team1: "Texas A&M", seed2: 2, team2: "Houston", spread: -10.5, fav: "Houston", ml1: "+400", ml2: "-535", total: 142.5, time: "6:10 PM ET", location: "Oklahoma City", bpi: "Houston by 9.2 pts (81%)" },
  { seed1: 11, team1: "Texas", seed2: 3, team2: "Gonzaga", spread: -6.5, fav: "Gonzaga", ml1: "+205", ml2: "-250", total: 147.5, time: "7:10 PM ET", location: "Portland, OR", bpi: "Gonzaga by 6.8 pts (75%)" },
  { seed1: 11, team1: "VCU", seed2: 3, team2: "Illinois", spread: -11.5, fav: "Illinois", ml1: "+425", ml2: "-575", total: 151.5, time: "7:50 PM ET", location: "Greenville, SC", bpi: "Illinois by 9.7 pts (82%)" },
  { seed1: 5, team1: "Vanderbilt", seed2: 4, team2: "Nebraska", spread: -1.5, fav: "Vanderbilt", ml1: "-125", ml2: "+114", total: 146.5, time: "8:45 PM ET", location: "Oklahoma City", bpi: "Vanderbilt by 0.8 pts (53%)" },
  { seed1: 12, team1: "High Point", seed2: 4, team2: "Arkansas", spread: -11.5, fav: "Arkansas", ml1: "+500", ml2: "-700", total: 168.5, time: "9:45 PM ET", location: "Portland, OR", bpi: "Arkansas by 8.2 pts (79%)" },
];

const MM_ROUND2_SUN = [
  { seed1: 7, team1: "Miami (FL)", seed2: 2, team2: "Purdue", spread: -7.5, fav: "Purdue", ml1: "+260", ml2: "-325", total: 147.5, time: "12:10 PM ET", location: "St. Louis", bpi: "Purdue by 7.8 pts (78%)" },
  { seed1: 7, team1: "Kentucky", seed2: 2, team2: "Iowa State", spread: -4.5, fav: "Iowa State", ml1: "+180", ml2: "-218", total: 145.5, time: "2:45 PM ET", location: "St. Louis", bpi: "Iowa State by 5.5 pts (71%)" },
  { seed1: 5, team1: "St. John's", seed2: 4, team2: "Kansas", spread: -3.5, fav: "St. John's", ml1: "-162", ml2: "+136", total: 144.5, time: "5:15 PM ET", location: "San Diego", bpi: "St. John's by 1.8 pts (57%)" },
  { seed1: 6, team1: "Tennessee", seed2: 3, team2: "Virginia", spread: -1.5, fav: "Tennessee", ml1: "-118", ml2: "-102", total: 137.5, time: "6:10 PM ET", location: "Philadelphia", bpi: "Tennessee by 2.7 pts (61%)" },
  { seed1: 9, team1: "Iowa", seed2: 1, team2: "Florida", spread: -10.5, fav: "Florida", ml1: "+440", ml2: "-600", total: 144.5, time: "7:10 PM ET", location: "Tampa, FL", bpi: "Florida by 8.1 pts (79%)" },
  { seed1: 9, team1: "Utah State", seed2: 1, team2: "Arizona", spread: -11.5, fav: "Arizona", ml1: "+550", ml2: "-800", total: 155.5, time: "7:50 PM ET", location: "San Diego", bpi: "Arizona by 9.9 pts (83%)" },
  { seed1: 7, team1: "UCLA", seed2: 2, team2: "UConn", spread: -4.5, fav: "UConn", ml1: "+154", ml2: "-185", total: 136.5, time: "8:45 PM ET", location: "Philadelphia", bpi: "UConn by 4.3 pts (67%)" },
  { seed1: 5, team1: "Texas Tech", seed2: 4, team2: "Alabama", spread: -1.5, fav: "Alabama", ml1: "-108", ml2: "-112", total: 164.5, time: "9:45 PM ET", location: "Tampa, FL", bpi: "Alabama by 1.1 pts (54%)" },
];

const MM_R1_UPSETS = [
  { winner: "High Point", wSeed: 12, loser: "Wisconsin", lSeed: 5, score: "78-72", region: "West" },
  { winner: "VCU", wSeed: 11, loser: "North Carolina", lSeed: 6, score: "71-68", region: "East" },
  { winner: "Texas", wSeed: 11, loser: "BYU", lSeed: 6, score: "79-71", region: "West" },
  { winner: "Texas A&M", wSeed: 10, loser: "Marquette", lSeed: 7, score: "TBD", region: "South" },
];

const MM_R1_CLOSE_CALLS = [
  { winner: "Duke", wSeed: 1, loser: "Siena", lSeed: 16, note: "Trailed by double digits in 1st half, rallied behind Boozer's 22pts/13reb" },
  { winner: "Kentucky", wSeed: 7, loser: "Santa Clara", lSeed: 10, note: "Oweh half-court buzzer beater forced OT, won 89-84" },
  { winner: "Virginia", wSeed: 3, loser: "Wright State", lSeed: 14, note: "Wright State led 56-55 with 12 min left before Virginia pulled away" },
];

const HISTORICAL_SEED_ATS: { seed: number; wins: number; losses: number; pct: number; upsetPct: number }[] = [
  { seed: 1, wins: 145, losses: 144, pct: 50.2, upsetPct: 1.1 },
  { seed: 2, wins: 100, losses: 120, pct: 45.5, upsetPct: 6.3 },
  { seed: 3, wins: 102, losses: 103, pct: 49.8, upsetPct: 15.2 },
  { seed: 4, wins: 89, losses: 92, pct: 49.2, upsetPct: 21.4 },
  { seed: 5, wins: 79, losses: 76, pct: 51.0, upsetPct: 35.3 },
  { seed: 6, wins: 58, losses: 67, pct: 46.4, upsetPct: 40.4 },
  { seed: 7, wins: 76, losses: 63, pct: 54.7, upsetPct: 39.5 },
  { seed: 8, wins: 60, losses: 59, pct: 50.4, upsetPct: 48.8 },
  { seed: 9, wins: 58, losses: 55, pct: 51.3, upsetPct: 51.2 },
  { seed: 10, wins: 51, losses: 56, pct: 47.7, upsetPct: 39.5 },
  { seed: 11, wins: 92, losses: 71, pct: 56.4, upsetPct: 40.4 },
  { seed: 12, wins: 62, losses: 53, pct: 53.9, upsetPct: 35.3 },
  { seed: 13, wins: 43, losses: 49, pct: 46.7, upsetPct: 20.8 },
  { seed: 14, wins: 34, losses: 49, pct: 41.0, upsetPct: 15.2 },
  { seed: 15, wins: 43, losses: 38, pct: 53.1, upsetPct: 8.8 },
  { seed: 16, wins: 69, losses: 66, pct: 51.1, upsetPct: 1.3 },
];

const MM_SCHEDULE = [
  { round: "First Round", dates: "Mar 19-20", status: "COMPLETE" },
  { round: "Second Round", dates: "Mar 21-22", status: "TODAY" },
  { round: "Sweet 16", dates: "Mar 26-27", status: "UPCOMING" },
  { round: "Elite Eight", dates: "Mar 28-29", status: "UPCOMING" },
  { round: "Final Four", dates: "Apr 5", status: "UPCOMING" },
  { round: "Championship", dates: "Apr 7", status: "UPCOMING" },
];

const MM_REGIONS = [
  { name: "East", no1: "Duke", site: "Newark, NJ", ff: "San Antonio" },
  { name: "West", no1: "Arizona", site: "San Francisco, CA", ff: "San Antonio" },
  { name: "South", no1: "Florida", site: "Atlanta, GA", ff: "San Antonio" },
  { name: "Midwest", no1: "Michigan", site: "Indianapolis, IN", ff: "San Antonio" },
];

/* ========================================================================
   MOCK DATA — Realistic odds, lines, and betting data
   ======================================================================== */

const NFL_GAMES = [
  { away: "Kansas City Chiefs", home: "Buffalo Bills", time: "Sun 4:25 PM", dk: { awayML: -145, homeML: +125, spread: -2.5, total: 48.5 }, fd: { awayML: -140, homeML: +120, spread: -2.5, total: 49 }, mgm: { awayML: -150, homeML: +130, spread: -3, total: 48.5 }, caesars: { awayML: -142, homeML: +122, spread: -2.5, total: 49 } },
  { away: "Philadelphia Eagles", home: "Dallas Cowboys", time: "Sun 8:20 PM", dk: { awayML: -180, homeML: +155, spread: -3.5, total: 45.5 }, fd: { awayML: -175, homeML: +150, spread: -3.5, total: 46 }, mgm: { awayML: -185, homeML: +160, spread: -4, total: 45.5 }, caesars: { awayML: -178, homeML: +152, spread: -3.5, total: 45.5 } },
  { away: "San Francisco 49ers", home: "Detroit Lions", time: "Mon 8:15 PM", dk: { awayML: +110, homeML: -130, spread: +1.5, total: 51 }, fd: { awayML: +108, homeML: -128, spread: +1.5, total: 51.5 }, mgm: { awayML: +115, homeML: -135, spread: +2, total: 51 }, caesars: { awayML: +112, homeML: -132, spread: +1.5, total: 51 } },
];

const NBA_GAMES = [
  { away: "Boston Celtics", home: "Milwaukee Bucks", time: "Sat 8:00 PM", dk: { awayML: -155, homeML: +135, spread: -3, total: 228.5 }, fd: { awayML: -150, homeML: +130, spread: -3, total: 229 }, mgm: { awayML: -160, homeML: +140, spread: -3.5, total: 228 }, caesars: { awayML: -152, homeML: +132, spread: -3, total: 228.5 } },
  { away: "Denver Nuggets", home: "LA Lakers", time: "Sat 10:30 PM", dk: { awayML: -120, homeML: +100, spread: -1.5, total: 222 }, fd: { awayML: -118, homeML: -102, spread: -1.5, total: 222.5 }, mgm: { awayML: -125, homeML: +105, spread: -2, total: 221.5 }, caesars: { awayML: -120, homeML: +100, spread: -1.5, total: 222 } },
];

const MLB_GAMES = [
  { away: "NY Yankees", home: "LA Dodgers", time: "Sat 7:10 PM", dk: { awayML: +130, homeML: -150, spread: +1.5, total: 8.5 }, fd: { awayML: +128, homeML: -148, spread: +1.5, total: 8.5 }, mgm: { awayML: +135, homeML: -155, spread: +1.5, total: 9 }, caesars: { awayML: +132, homeML: -152, spread: +1.5, total: 8.5 } },
  { away: "Houston Astros", home: "Atlanta Braves", time: "Sat 4:05 PM", dk: { awayML: -108, homeML: -112, spread: -1.5, total: 7.5 }, fd: { awayML: -106, homeML: -114, spread: -1.5, total: 7.5 }, mgm: { awayML: -110, homeML: -110, spread: -1.5, total: 8 }, caesars: { awayML: -108, homeML: -112, spread: -1.5, total: 7.5 } },
];

const LINE_MOVEMENTS = [
  { game: "Chiefs @ Bills", open: -1.5, current: -2.5, move: -1, direction: "away", sharp: true, pctPublic: 62, pctSharp: 38 },
  { game: "Eagles @ Cowboys", open: -4, current: -3.5, move: +0.5, direction: "home", sharp: false, pctPublic: 71, pctSharp: 29 },
  { game: "49ers @ Lions", open: +2.5, current: +1.5, move: -1, direction: "away", sharp: true, pctPublic: 55, pctSharp: 45 },
  { game: "Celtics @ Bucks", open: -2.5, current: -3, move: -0.5, direction: "away", sharp: false, pctPublic: 68, pctSharp: 32 },
  { game: "Nuggets @ Lakers", open: -2.5, current: -1.5, move: +1, direction: "home", sharp: true, pctPublic: 74, pctSharp: 26 },
  { game: "Yankees @ Dodgers", open: -160, current: -150, move: +10, direction: "home", sharp: true, pctPublic: 58, pctSharp: 42 },
];

const ARBITRAGE_OPPS = [
  { sport: "NFL", game: "Chiefs @ Bills", edge: 2.3, book1: "DraftKings", book2: "BetMGM", market: "Moneyline", roi: "$23/1K" },
  { sport: "NBA", game: "Nuggets @ Lakers", edge: 1.8, book1: "FanDuel", book2: "Caesars", market: "Spread", roi: "$18/1K" },
  { sport: "MLB", game: "Yankees @ Dodgers", edge: 3.1, book1: "BetMGM", book2: "DraftKings", market: "Total O/U", roi: "$31/1K" },
  { sport: "NHL", game: "Rangers @ Bruins", edge: 1.5, book1: "Caesars", book2: "FanDuel", market: "Moneyline", roi: "$15/1K" },
  { sport: "UFC", game: "Main Event", edge: 4.2, book1: "BetMGM", book2: "DraftKings", market: "Moneyline", roi: "$42/1K" },
];

const PUBLIC_BETS = [
  { game: "Chiefs @ Bills", publicPct: 72, side: "Chiefs", sharpSide: "Bills", rlm: true },
  { game: "Eagles @ Cowboys", publicPct: 78, side: "Eagles", sharpSide: "Eagles", rlm: false },
  { game: "49ers @ Lions", publicPct: 55, side: "Lions", sharpSide: "49ers", rlm: true },
  { game: "Celtics @ Bucks", publicPct: 68, side: "Celtics", sharpSide: "Celtics", rlm: false },
  { game: "Nuggets @ Lakers", publicPct: 74, side: "Lakers", sharpSide: "Nuggets", rlm: true },
  { game: "Yankees @ Dodgers", publicPct: 65, side: "Dodgers", sharpSide: "Yankees", rlm: true },
];

const SHARP_INDICATORS = [
  { game: "Chiefs @ Bills", indicator: "REVERSE LINE MOVEMENT", detail: "72% on Chiefs, line moved TO Bills -2.5 → -1.5", severity: "high" },
  { game: "Nuggets @ Lakers", indicator: "STEAM MOVE", detail: "Sharp action detected: Lakers ML moved from +100 to -105 in 4 min", severity: "high" },
  { game: "49ers @ Lions", indicator: "CONTRARIAN PLAY", detail: "Only 45% on 49ers but line shortened from +2.5 to +1.5", severity: "medium" },
  { game: "Yankees @ Dodgers", indicator: "SHARP MONEY", detail: "42% of tickets but 61% of money on Yankees", severity: "medium" },
  { game: "Eagles @ Cowboys", indicator: "TRAP LINE", detail: "Public hammering Eagles -3.5 but no movement — potential trap", severity: "low" },
];

/* ========================================================================
   HELPER COMPONENTS
   ======================================================================== */

function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function OddsCell({ value, best }: { value: number; best?: boolean }) {
  return (
    <span className={`font-mono text-sm ${best ? "text-green-400 font-bold" : "text-gray-300"}`}>
      {formatOdds(value)}
    </span>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="text-center px-6 py-4">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-2xl md:text-3xl font-black text-white">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function SeverityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colors[level] || colors.low}`}>
      {level}
    </span>
  );
}

/* ========================================================================
   MAIN PAGE
   ======================================================================== */

export default function SportsPage() {
  const [pageTab, setPageTab] = useState<"madness" | "picks" | "tickets" | "overunder" | "sportsbook" | "dashboard">("madness");
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketStats, setTicketStats] = useState<any>({});
  const [liveOdds, setLiveOdds] = useState<any[]>([]);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [oddsLive, setOddsLive] = useState(false);
  const [ouSport, setOuSport] = useState("basketball_ncaab");
  const [ouData, setOuData] = useState<Record<string, any[]>>({});
  const [ouLoading, setOuLoading] = useState(false);
  const [oddsTab, setOddsTab] = useState<"nfl" | "nba" | "mlb">("nfl");
  const [marketTab, setMarketTab] = useState<"ml" | "spread" | "total">("ml");
  const [mmDay, setMmDay] = useState<"sat" | "sun">("sat");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", bettingExperience: "", primarySport: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pulseIdx, setPulseIdx] = useState(0);

  // Dashboard state
  const [dashStats, setDashStats] = useState<any>(null);
  const [dashPicks, setDashPicks] = useState<any[]>([]);
  const [dashLoading, setDashLoading] = useState(false);
  const [showAddPick, setShowAddPick] = useState(false);
  const [pickForm, setPickForm] = useState({ game: "", sport: "NCAAB", pickType: "spread", pick: "", odds: "", stake: "", notes: "" });
  const [pickFilter, setPickFilter] = useState("all");

  function loadDashboard() {
    setDashLoading(true);
    fetch(`/api/sports/picks?status=${pickFilter}`)
      .then((r) => r.json())
      .then((data) => {
        setDashStats(data.stats || {});
        setDashPicks(data.picks || []);
      })
      .catch(() => {})
      .finally(() => setDashLoading(false));
  }

  useEffect(() => {
    if (pageTab === "dashboard") loadDashboard();
  }, [pageTab, pickFilter]);

  async function handleAddPick(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/sports/picks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pickForm),
      });
      setPickForm({ game: "", sport: "NCAAB", pickType: "spread", pick: "", odds: "", stake: "", notes: "" });
      setShowAddPick(false);
      loadDashboard();
    } catch {}
  }

  async function settlePick(id: string, status: string) {
    try {
      await fetch("/api/sports/picks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      loadDashboard();
    } catch {}
  }

  useEffect(() => {
    const interval = setInterval(() => setPulseIdx((i) => (i + 1) % ARBITRAGE_OPPS.length), 2000);
    return () => clearInterval(interval);
  }, []);

  // Load live odds
  function fetchLiveOdds() {
    setOddsLoading(true);
    fetch("/api/sports/odds?sport=basketball_ncaab")
      .then((r) => r.json())
      .then((data) => {
        if (data.live && data.games) {
          setLiveOdds(data.games);
          setOddsLive(true);
        }
      })
      .catch(() => {})
      .finally(() => setOddsLoading(false));
  }

  useEffect(() => {
    fetchLiveOdds();
    const iv = setInterval(fetchLiveOdds, 60000);
    return () => clearInterval(iv);
  }, []);

  // Tickets tab data
  function fetchTickets() {
    setTicketsLoading(true);
    fetch("/api/sports/picks")
      .then((r) => r.json())
      .then((data) => {
        if (data.picks) setTickets(data.picks);
        if (data.stats) setTicketStats(data.stats);
      })
      .catch(() => {})
      .finally(() => setTicketsLoading(false));
  }

  useEffect(() => {
    if (pageTab === "tickets") fetchTickets();
  }, [pageTab]);

  // O/U tab data
  const OU_SPORTS = [
    { key: "basketball_ncaab", label: "March Madness", icon: "\u{1F3C0}", color: "green" },
    { key: "basketball_nba", label: "NBA", icon: "\u{1F3C0}", color: "orange" },
    { key: "icehockey_nhl", label: "NHL", icon: "\u{1F3D2}", color: "blue" },
    { key: "baseball_mlb_preseason", label: "MLB (Spring)", icon: "\u26BE", color: "red" },
    { key: "mma_mixed_martial_arts", label: "MMA / UFC", icon: "\u{1F94A}", color: "red" },
    { key: "soccer_epl", label: "EPL Soccer", icon: "\u26BD", color: "purple" },
  ];

  function fetchOU(sportKey: string) {
    if (ouData[sportKey]) { setOuSport(sportKey); return; }
    setOuLoading(true);
    setOuSport(sportKey);
    fetch(`/api/sports/odds?sport=${sportKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.games) {
          setOuData((prev) => ({ ...prev, [sportKey]: data.games }));
        }
      })
      .catch(() => {})
      .finally(() => setOuLoading(false));
  }

  useEffect(() => {
    if (pageTab === "overunder" && !ouData[ouSport]) fetchOU(ouSport);
  }, [pageTab]);

  const currentGames = oddsTab === "nfl" ? NFL_GAMES : oddsTab === "nba" ? NBA_GAMES : MLB_GAMES;

  function getBestML(games: typeof NFL_GAMES, side: "away" | "home") {
    return games.map((g) => {
      const vals = [
        { book: "dk", val: side === "away" ? g.dk.awayML : g.dk.homeML },
        { book: "fd", val: side === "away" ? g.fd.awayML : g.fd.homeML },
        { book: "mgm", val: side === "away" ? g.mgm.awayML : g.mgm.homeML },
        { book: "caesars", val: side === "away" ? g.caesars.awayML : g.caesars.homeML },
      ];
      const best = vals.reduce((a, b) => (a.val > b.val ? a : b));
      return best.book;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/sports/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSubmitted(true);
    } catch {}
    setSubmitting(false);
  }

  return (
    <>
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              { "@type": "Question", name: "What is value betting?", acceptedAnswer: { "@type": "Answer", text: "Value betting means placing wagers where the odds offered by the sportsbook are higher than the true probability of the outcome. By consistently finding and betting value, you gain a mathematical edge over the house." } },
              { "@type": "Question", name: "How does arbitrage betting work?", acceptedAnswer: { "@type": "Answer", text: "Arbitrage betting exploits price differences between sportsbooks. When two books disagree on odds enough, you can bet both sides and guarantee a profit regardless of outcome. Typical edges range from 1-5%." } },
              { "@type": "Question", name: "What is the Kelly Criterion?", acceptedAnswer: { "@type": "Answer", text: "The Kelly Criterion is a mathematical formula for optimal bet sizing. It calculates the ideal percentage of your bankroll to wager based on your edge and the odds offered, maximizing long-term growth while minimizing risk of ruin." } },
              { "@type": "Question", name: "What is reverse line movement in sports betting?", acceptedAnswer: { "@type": "Answer", text: "Reverse line movement occurs when the betting line moves opposite to the direction public money is flowing. For example, if 75% of bets are on Team A but the line moves toward Team B, it indicates sharp (professional) money on Team B." } },
              { "@type": "Question", name: "How do sharp bettors differ from the public?", acceptedAnswer: { "@type": "Answer", text: "Sharp bettors use data, models, and disciplined bankroll management. They bet early to move lines, focus on value rather than favorites, and maintain long-term profitability. The public tends to bet favorites, overs, and popular teams based on emotion." } },
              { "@type": "Question", name: "What is line shopping and why does it matter?", acceptedAnswer: { "@type": "Answer", text: "Line shopping means comparing odds across multiple sportsbooks to find the best price for your bet. Even half-point differences in spreads or 10-point differences in moneylines compound into significant profit over hundreds of bets." } },
              { "@type": "Question", name: "Can you make a living from sports betting?", acceptedAnswer: { "@type": "Answer", text: "Professional sports bettors exist, but it requires significant bankroll, sophisticated modeling, strict discipline, and access to multiple sportsbooks. Most profitable bettors treat it as a business with detailed tracking, analysis, and risk management." } },
              { "@type": "Question", name: "What data do professional sports bettors use?", acceptedAnswer: { "@type": "Answer", text: "Professionals use real-time odds feeds, line movement data, public betting percentages, weather data, injury reports, historical performance models, expected value calculators, and sharp money indicators to make informed decisions." } },
            ],
          }),
        }}
      />

      <Breadcrumbs items={[{ label: "Sports Betting Intelligence" }]} />

      {/* ================================================================
          PAGE TAB SWITCHER
          ================================================================ */}
      <div className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
        <div className="max-w-6xl mx-auto flex gap-2 px-4 py-3">
          <button
            onClick={() => setPageTab("madness")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "madness"
                ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <span className="text-lg">&#x1F680;</span>
            NCAA March Madness
          </button>
          <button
            onClick={() => setPageTab("picks")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "picks"
                ? "bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white shadow-lg shadow-[#FF8900]/20"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <span className="text-lg">&#x1F3AF;</span>
            Picks Pending
          </button>
          <button
            onClick={() => { setPageTab("tickets"); fetchTickets(); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "tickets"
                ? "bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-lg shadow-green-500/20"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <span className="text-lg">&#x1F3AB;</span>
            Tickets
          </button>
          <button
            onClick={() => { setPageTab("overunder"); if (!ouData[ouSport]) fetchOU(ouSport); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "overunder"
                ? "bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/20"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <span className="text-lg">&#x2B06;&#x2B07;</span>
            Over/Under
          </button>
          <button
            onClick={() => setPageTab("sportsbook")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "sportsbook"
                ? "bg-[#FF8900] text-black"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            All Sports
          </button>
          <button
            onClick={() => setPageTab("dashboard")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
              pageTab === "dashboard"
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            <span className="text-lg">&#x1F4CA;</span>
            Reports
          </button>
        </div>
      </div>

      {/* ================================================================
          MARCH MADNESS SECTION
          ================================================================ */}
      {pageTab === "madness" && (
        <>
          {/* MM Hero */}
          <section className="relative overflow-hidden pt-12 pb-16 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1a0a] to-black" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(34,197,94,0.4) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(34,197,94,0.4) 50px)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/8 rounded-full blur-[120px]" />

            <div className="relative max-w-6xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Tournament Live -- Round 2 Today</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
                  <span className="text-lg mr-2">&#x1F680;</span>
                  MARCH
                  <br />
                  <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    MADNESS 2026
                  </span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                  68 teams. $4 billion wagered. Every edge, every angle, every profitable seed trend since 1985.
                  This is your war room.
                </p>
              </div>

              {/* Tournament Schedule Bar */}
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                {MM_SCHEDULE.map((s, i) => (
                  <div
                    key={i}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                      s.status === "TODAY"
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : s.status === "COMPLETE"
                        ? "bg-white/5 border-white/10 text-gray-500 line-through"
                        : "bg-[#1a1a1a] border-white/5 text-gray-500"
                    }`}
                  >
                    {s.round} <span className="text-gray-600 ml-1">{s.dates}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4 Regions */}
          <section className="py-8 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
              {MM_REGIONS.map((r, i) => (
                <div key={i} className="bg-[#111] border border-green-500/10 rounded-xl p-4 text-center hover:border-green-500/30 transition-all">
                  <div className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1">{r.name} Region</div>
                  <div className="text-white font-black text-lg">#{`1`} {r.no1}</div>
                  <div className="text-gray-500 text-xs">{r.site}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Title Odds */}
          <section className="py-12 px-4 bg-black">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black mb-2">
                Championship <span className="text-green-400">Odds</span>
              </h2>
              <p className="text-gray-500 mb-6">Current odds to win the 2026 NCAA Tournament -- updated after Round 1</p>

              <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1a1a1a] border-b border-white/5">
                        <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Seed</th>
                        <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Team</th>
                        <th className="text-left px-4 py-3 text-gray-500 text-xs uppercase">Region</th>
                        <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Odds</th>
                        <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Record</th>
                        <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Tickets %</th>
                        <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Handle %</th>
                        <th className="text-center px-4 py-3 text-gray-500 text-xs uppercase">Edge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MM_TITLE_ODDS.map((t, i) => {
                        const handleVsTicket = t.handlePct - t.ticketPct;
                        return (
                          <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-[#111]" : "bg-[#0d0d0d]"} hover:bg-[#1a1a1a] transition-colors`}>
                            <td className="px-4 py-3">
                              <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded">{t.seed}</span>
                            </td>
                            <td className="px-4 py-3 text-white font-bold text-sm">{t.team}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{t.region}</td>
                            <td className="px-4 py-3 text-center text-green-400 font-mono font-bold">{t.odds}</td>
                            <td className="px-4 py-3 text-center text-gray-300 font-mono text-xs">{t.record}</td>
                            <td className="px-4 py-3 text-center text-gray-300 text-xs">{t.ticketPct}%</td>
                            <td className="px-4 py-3 text-center text-white font-bold text-xs">{t.handlePct}%</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-bold ${handleVsTicket > 2 ? "text-green-400" : handleVsTicket > 0 ? "text-yellow-400" : "text-red-400"}`}>
                                {handleVsTicket > 0 ? "+" : ""}{handleVsTicket.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-[#1a1a1a] border-t border-white/5">
                  <p className="text-gray-500 text-xs">
                    <strong className="text-green-400">EDGE column</strong> = Handle % minus Ticket %. Positive means sharp money is overweight (big bettors like the team more than the public).
                    Arizona (+5.7%) and Michigan (+2.6%) show the strongest sharp action.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Round 2 Games - LIVE DATA */}
          <section className="py-12 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                {oddsLive ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400 text-xs font-bold uppercase tracking-wider">LIVE ODDS -- Auto-refreshing every 60s</span>
                  </>
                ) : (
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Loading live odds...</span>
                )}
              </div>
              <h2 className="text-3xl font-black mb-6">
                Second Round <span className="text-green-400">Live Lines</span>
              </h2>

              {liveOdds.length === 0 && <div className="text-gray-500 text-center py-8">Loading live odds data...</div>}

              <div className="space-y-3">
                {liveOdds.map((game: any, i: number) => {
                  const dk = game.bookmakers?.find((b: any) => b.key === "draftkings");
                  const fd = game.bookmakers?.find((b: any) => b.key === "fanduel");
                  const mgm = game.bookmakers?.find((b: any) => b.key === "betmgm");

                  const getMarket = (bk: any, mkt: string, team?: string) => {
                    if (!bk) return null;
                    const m = bk.markets?.find((x: any) => x.key === mkt);
                    if (!m) return null;
                    if (team) return m.outcomes?.find((o: any) => o.name === team);
                    return m.outcomes?.[0];
                  };

                  const homeML = getMarket(dk, "h2h", game.home_team);
                  const awayML = getMarket(dk, "h2h", game.away_team);
                  const homeSpread = getMarket(dk, "spreads", game.home_team);
                  const awaySpread = getMarket(dk, "spreads", game.away_team);
                  const over = getMarket(dk, "totals");

                  // Get best ML across books
                  const allBooks = [dk, fd, mgm].filter(Boolean);
                  const bestHomeML = Math.max(...allBooks.map((b: any) => getMarket(b, "h2h", game.home_team)?.price || -9999));
                  const bestAwayML = Math.max(...allBooks.map((b: any) => getMarket(b, "h2h", game.away_team)?.price || -9999));

                  const gameTime = new Date(game.commence_time);
                  const timeStr = gameTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" });
                  const dateStr = gameTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" });

                  return (
                    <div key={game.id || i} className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-green-500/20 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1 min-w-[240px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-sm">{game.away_team}</span>
                            <span className={`font-mono text-xs ${awayML && awayML.price > 0 ? "text-green-400" : "text-gray-400"}`}>
                              {awayML ? (awayML.price > 0 ? `+${awayML.price}` : awayML.price) : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">@ {game.home_team}</span>
                            <span className={`font-mono text-xs font-bold ${homeML && homeML.price < 0 ? "text-green-400" : "text-gray-400"}`}>
                              {homeML ? (homeML.price > 0 ? `+${homeML.price}` : homeML.price) : ""}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-gray-500 text-[10px] uppercase">Spread</div>
                            <div className="text-white font-mono font-bold text-sm">
                              {homeSpread ? `${homeSpread.point > 0 ? "+" : ""}${homeSpread.point}` : "N/A"}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500 text-[10px] uppercase">O/U</div>
                            <div className="text-white font-mono text-sm">{over?.point || "N/A"}</div>
                          </div>
                        </div>

                        {/* Book comparison */}
                        <div className="flex items-center gap-3">
                          {[
                            { name: "DK", book: dk, color: "text-green-400" },
                            { name: "FD", book: fd, color: "text-blue-400" },
                            { name: "MGM", book: mgm, color: "text-yellow-400" },
                          ].map(({ name, book, color }) => {
                            const ml = getMarket(book, "h2h", game.home_team);
                            return (
                              <div key={name} className="text-center">
                                <div className={`text-[10px] font-bold ${color}`}>{name}</div>
                                <div className="text-white font-mono text-xs">
                                  {ml ? (ml.price > 0 ? `+${ml.price}` : ml.price) : "--"}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-right min-w-[100px]">
                          <div className="text-green-400 font-bold text-sm">{timeStr}</div>
                          <div className="text-gray-500 text-xs">{dateStr}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Round 1 Upsets & Close Calls */}
          <section className="py-12 px-4 bg-black">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-black mb-4">
                  Round 1 <span className="text-red-400">Upsets</span>
                </h2>
                <div className="space-y-3">
                  {MM_R1_UPSETS.map((u, i) => (
                    <div key={i} className="bg-[#111] border border-red-500/10 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded mr-2">UPSET</span>
                          <span className="text-white font-bold text-sm">({u.wSeed}) {u.winner}</span>
                          <span className="text-gray-500 text-xs"> def. ({u.lSeed}) {u.loser}</span>
                        </div>
                        <span className="text-white font-mono text-sm">{u.score}</span>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">{u.region} Region</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black mb-4">
                  Close <span className="text-yellow-400">Calls</span>
                </h2>
                <div className="space-y-3">
                  {MM_R1_CLOSE_CALLS.map((c, i) => (
                    <div key={i} className="bg-[#111] border border-yellow-500/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">SCARE</span>
                        <span className="text-white font-bold text-sm">({c.wSeed}) {c.winner} survived ({c.lSeed}) {c.loser}</span>
                      </div>
                      <div className="text-gray-400 text-xs">{c.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Historical ATS by Seed */}
          <section className="py-12 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black mb-2">
                Historical ATS <span className="text-green-400">by Seed</span>
              </h2>
              <p className="text-gray-500 mb-6">Against-the-spread performance since 1985 and first-round upset rate. These are the edges.</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ATS Win % Chart */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">ATS Cover Rate by Seed (Since 1985)</h3>
                  <div className="space-y-2">
                    {HISTORICAL_SEED_ATS.map((s) => (
                      <div key={s.seed} className="flex items-center gap-3">
                        <span className="text-gray-400 font-mono text-xs w-6 text-right">#{s.seed}</span>
                        <div className="flex-1 relative h-5 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                              s.pct >= 53 ? "bg-green-500" : s.pct >= 50 ? "bg-green-500/60" : s.pct >= 47 ? "bg-yellow-500/60" : "bg-red-500/60"
                            }`}
                            style={{ width: `${s.pct}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="text-[10px] font-bold text-white drop-shadow">{s.pct}%</span>
                          </div>
                        </div>
                        <span className="text-gray-500 text-[10px] w-16">{s.wins}-{s.losses}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-green-400 text-xs font-bold">TOP PLAYS: #11 seed (56.4%), #7 seed (54.7%), #12 seed (53.9%), #15 seed (53.1%)</p>
                  </div>
                </div>

                {/* First Round Upset % */}
                <div className="bg-[#111] border border-white/5 rounded-xl p-5">
                  <h3 className="text-white font-bold text-sm mb-4">First Round Upset Rate by Matchup</h3>
                  <div className="space-y-3">
                    {[
                      { matchup: "5 vs 12", pct: 35.3, label: "Classic upset spot" },
                      { matchup: "6 vs 11", pct: 40.4, label: "Most likely upset" },
                      { matchup: "7 vs 10", pct: 39.5, label: "Near coin flip" },
                      { matchup: "8 vs 9", pct: 48.8, label: "Essentially even" },
                      { matchup: "4 vs 13", pct: 20.8, label: "Surprise upsets" },
                      { matchup: "3 vs 14", pct: 15.2, label: "Rare but happens" },
                      { matchup: "2 vs 15", pct: 8.8, label: "Cinderella zone" },
                      { matchup: "1 vs 16", pct: 1.3, label: "Lightning strike" },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-white font-mono font-bold text-xs w-16">{m.matchup}</span>
                        <div className="flex-1 relative h-6 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 to-red-500/60 transition-all duration-1000"
                            style={{ width: `${m.pct}%` }}
                          />
                          <div className="absolute inset-0 flex items-center justify-between px-2">
                            <span className="text-[10px] font-bold text-white drop-shadow">{m.pct}%</span>
                            <span className="text-[10px] text-gray-400">{m.label}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <p className="text-red-400 text-xs font-bold">52.8% of first-round games since 2015 have been upsets ATS</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* March Madness Money-Making Playbook */}
          <section className="py-12 px-4 bg-black">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black mb-2">
                <span className="text-lg mr-2">&#x1F680;</span>
                March Madness <span className="text-green-400">Money Playbook</span>
              </h2>
              <p className="text-gray-500 mb-8">Proven strategies backed by decades of tournament data</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Fade the #2 Seeds", desc: "2-seeds have the WORST ATS cover rate of any top-4 seed at 45.5%. The public overvalues them and inflates spreads. Bet against them or take their opponents plus the points.", color: "from-red-500/10 to-red-500/5", badge: "45.5% ATS" },
                  { title: "Back the #11 Seeds", desc: "The most profitable seed in tournament history at 56.4% ATS. These are usually talented major-conference teams that 'underperformed' in the regular season. They have the talent to cover and win.", color: "from-green-500/10 to-green-500/5", badge: "56.4% ATS" },
                  { title: "5-12 Upset Special", desc: "12-seeds beat 5-seeds 35.3% of the time straight up, and COVER 53.9% ATS. Take 12-seeds plus the points in the first round -- it's practically a market inefficiency.", color: "from-green-500/10 to-green-500/5", badge: "53.9% ATS" },
                  { title: "First Half Unders", desc: "Tournament first halves trend under. Nerves, unfamiliar opponents, and neutral courts slow the pace. First-half unders in Round 1 have been profitable since 2015.", color: "from-blue-500/10 to-blue-500/5", badge: "TREND" },
                  { title: "Mid-Major Cinderellas", desc: "15-seeds cover 53.1% ATS. Spreads are so large that even losing by 12 cashes the ticket. Bet the underdog plus the points in massive mismatches.", color: "from-green-500/10 to-green-500/5", badge: "53.1% ATS" },
                  { title: "Contrarian Sweet 16", desc: "By the Sweet 16, public money piles onto favorites. Historically, lower seeds cover at higher rates in later rounds as spreads tighten and the public overreacts to brand names.", color: "from-purple-500/10 to-purple-500/5", badge: "EDGE" },
                  { title: "BPI vs Spread Divergence", desc: "When ESPN's BPI projects a team to win by LESS than the spread, take the underdog. The Louisville-Michigan St game today: BPI says Louisville by 0.2 but MSU is -4.5. Louisville +4.5 is the play.", color: "from-yellow-500/10 to-yellow-500/5", badge: "BPI EDGE" },
                  { title: "Injury Steam Moves", desc: "Iowa State's Joshua Jefferson injured his ankle in Round 1. Watch the Kentucky line movement -- if it stays or moves toward Iowa State despite the injury buzz, sharp money is on the Cyclones.", color: "from-red-500/10 to-red-500/5", badge: "LIVE" },
                  { title: "Conference ATS Trends", desc: "Track which conferences are covering. If SEC teams are 8-2 ATS in Round 1 and Big Ten is 4-6, ride the hot conference until the market adjusts. Conferences have distinct styles that travel differently.", color: "from-cyan-500/10 to-cyan-500/5", badge: "TREND" },
                ].map((s, i) => (
                  <div key={i} className={`bg-gradient-to-br ${s.color} border border-white/5 rounded-xl p-5 hover:border-green-500/20 transition-all hover:-translate-y-1`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-bold text-sm">{s.title}</h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">{s.badge}</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Today's Edges */}
          <section className="py-12 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-black mb-6">
                Today&apos;s <span className="text-green-400">Actionable Edges</span>
              </h2>
              <div className="space-y-3">
                {[
                  { game: "Louisville (+4.5) vs Michigan St", edge: "BPI DIVERGENCE", detail: "BPI says Louisville wins by 0.2 points, but Michigan St is -4.5. The spread is 4.7 points off the model. Louisville +4.5 is a strong play.", confidence: "high" },
                  { game: "Vanderbilt (-1.5) vs Nebraska", edge: "PICK'EM VALUE", detail: "BPI: Vandy by 0.8 (53%). This is essentially a coin flip, but Vanderbilt has more SEC tournament experience. Small edge on Vandy ML at -125.", confidence: "medium" },
                  { game: "High Point (+11.5) vs Arkansas", edge: "12-SEED ATS TREND", detail: "12-seeds cover 53.9% ATS historically. High Point just beat Wisconsin -- they have momentum and a nothing-to-lose mentality. Take the points.", confidence: "medium" },
                  { game: "Texas (+6.5) vs Gonzaga", edge: "11-SEED ADVANTAGE", detail: "11-seeds are the best ATS seed at 56.4%. Texas just knocked off BYU on the road. BPI: Gonzaga by 6.8 (75%) -- spread is close to model, so this is a lean, not a slam.", confidence: "low" },
                  { game: "VCU (+11.5) vs Illinois", edge: "UPSET MOMENTUM", detail: "VCU just upset #6 North Carolina. 11-seeds historically overperform ATS. But BPI says Illinois by 9.7 (82%). Take VCU plus the points for a small play.", confidence: "low" },
                ].map((e, i) => (
                  <div key={i} className={`bg-[#111] border rounded-xl p-5 ${e.confidence === "high" ? "border-green-500/30" : e.confidence === "medium" ? "border-yellow-500/20" : "border-white/5"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold">{e.game}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">{e.edge}</span>
                        <SeverityBadge level={e.confidence} />
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{e.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ================================================================
          DASHBOARD / REPORTS
          ================================================================ */}
      {pageTab === "dashboard" && (
        <>
          {/* Dashboard Hero */}
          <section className="relative overflow-hidden pt-12 pb-8 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a1a] to-black" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
            <div className="relative max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-purple-400 font-bold text-xs tracking-[0.3em] uppercase mb-2">Performance Tracker</p>
                  <h1 className="text-4xl md:text-5xl font-black">
                    Betting <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
                  </h1>
                </div>
                <button
                  onClick={() => setShowAddPick(true)}
                  className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all uppercase text-sm tracking-wider"
                >
                  + Log Pick
                </button>
              </div>

              {/* Big Stats Cards */}
              {dashStats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Win Rate</div>
                    <div className={`text-4xl md:text-5xl font-black ${dashStats.winPct >= 55 ? "text-green-400" : dashStats.winPct >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                      {dashStats.winPct || 0}%
                    </div>
                    <div className="text-gray-600 text-xs mt-1">{dashStats.wins || 0}W - {dashStats.losses || 0}L</div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Net P&L</div>
                    <div className={`text-4xl md:text-5xl font-black ${(dashStats.netGain || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {(dashStats.netGain || 0) >= 0 ? "+" : ""}${Math.abs(dashStats.netGain || 0).toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">ROI: {dashStats.roi || 0}%</div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Total Wagered</div>
                    <div className="text-3xl md:text-4xl font-black text-white">
                      ${(dashStats.totalWagered || 0).toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">{dashStats.settled || 0} settled bets</div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Streak</div>
                    <div className={`text-4xl md:text-5xl font-black ${(dashStats.streak || "").includes("W") ? "text-green-400" : (dashStats.streak || "").includes("L") ? "text-red-400" : "text-gray-400"}`}>
                      {dashStats.streak || "N/A"}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">Current run</div>
                  </div>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Pending</div>
                    <div className="text-4xl md:text-5xl font-black text-purple-400">
                      {dashStats.pending || 0}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">$1K-$5K per bet</div>
                  </div>
                </div>
              )}

              {/* Win/Loss Visual Bar */}
              {dashStats && dashStats.settled > 0 && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold text-sm">Win/Loss Distribution</span>
                    <span className="text-gray-500 text-xs">{dashStats.settled} settled picks</span>
                  </div>
                  <div className="relative h-10 bg-[#1a1a1a] rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center transition-all duration-1000"
                      style={{ width: `${dashStats.winPct}%` }}
                    >
                      {dashStats.winPct > 15 && (
                        <span className="text-xs font-bold text-white drop-shadow">{dashStats.wins}W ({dashStats.winPct}%)</span>
                      )}
                    </div>
                    {dashStats.pushes > 0 && (
                      <div
                        className="bg-yellow-500/60 flex items-center justify-center"
                        style={{ width: `${((dashStats.pushes / dashStats.settled) * 100)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">{dashStats.pushes}P</span>
                      </div>
                    )}
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center flex-1"
                    >
                      {dashStats.lossPct > 15 && (
                        <span className="text-xs font-bold text-white drop-shadow">{dashStats.losses}L ({dashStats.lossPct}%)</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Charts Row: Pie + Speedometer + P&L Graph */}
              {dashStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* PIE CHART - Win/Loss/Pending Distribution */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3 font-bold">Ticket Distribution</div>
                    <div className="relative w-48 h-48 mx-auto">
                      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                        {(() => {
                          const total = (dashStats.wins || 0) + (dashStats.losses || 0) + (dashStats.pushes || 0) + (dashStats.placed || dashStats.pending || 0);
                          if (total === 0) return <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1a1a" strokeWidth="24" />;
                          const segments = [
                            { count: dashStats.wins || 0, color: "#22C55E", label: "Wins" },
                            { count: dashStats.losses || 0, color: "#DC2626", label: "Losses" },
                            { count: dashStats.pushes || 0, color: "#EAB308", label: "Pushes" },
                            { count: dashStats.placed || dashStats.pending || 0, color: "#A855F7", label: "Placed" },
                          ].filter(s => s.count > 0);
                          let offset = 0;
                          const circumference = 2 * Math.PI * 80;
                          return segments.map((seg, i) => {
                            const pct = seg.count / total;
                            const dash = pct * circumference;
                            const gap = circumference - dash;
                            const el = (
                              <circle key={i} cx="100" cy="100" r="80" fill="none" stroke={seg.color} strokeWidth="24"
                                strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} />
                            );
                            offset += dash;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-black text-white">{(dashStats.wins || 0) + (dashStats.losses || 0) + (dashStats.pushes || 0) + (dashStats.placed || dashStats.pending || 0)}</div>
                        <div className="text-gray-500 text-xs">Total Tickets</div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-3 flex-wrap">
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" /><span className="text-gray-400">{dashStats.wins || 0} Win</span></span>
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" /><span className="text-gray-400">{dashStats.losses || 0} Loss</span></span>
                      <span className="text-xs"><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" /><span className="text-gray-400">{dashStats.placed || dashStats.pending || 0} Placed</span></span>
                    </div>
                  </div>

                  {/* SPEEDOMETER - ROI Gauge */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5 text-center">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3 font-bold">ROI Speedometer</div>
                    <div className="relative w-48 h-28 mx-auto overflow-hidden">
                      <svg viewBox="0 0 200 110" className="w-full h-full">
                        {/* Background arc */}
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1a1a1a" strokeWidth="16" strokeLinecap="round" />
                        {/* Red zone -50 to 0 */}
                        <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
                        {/* Green zone 0 to +50 */}
                        <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke="#22C55E" strokeWidth="16" strokeLinecap="round" opacity="0.3" />
                        {/* Needle */}
                        {(() => {
                          const roi = dashStats.roi || 0;
                          const clampedRoi = Math.max(-50, Math.min(50, roi));
                          const angle = ((clampedRoi + 50) / 100) * 180 - 180;
                          const rad = (angle * Math.PI) / 180;
                          const nx = 100 + 65 * Math.cos(rad);
                          const ny = 100 + 65 * Math.sin(rad);
                          return (
                            <>
                              <line x1="100" y1="100" x2={nx} y2={ny} stroke="#FF8900" strokeWidth="3" strokeLinecap="round" />
                              <circle cx="100" cy="100" r="6" fill="#FF8900" />
                            </>
                          );
                        })()}
                        <text x="20" y="108" fill="#DC2626" fontSize="10" fontWeight="700">-50%</text>
                        <text x="90" y="18" fill="#666" fontSize="10" fontWeight="700">0%</text>
                        <text x="160" y="108" fill="#22C55E" fontSize="10" fontWeight="700">+50%</text>
                      </svg>
                    </div>
                    <div className={`text-4xl font-black mt-2 ${(dashStats.roi || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {(dashStats.roi || 0) >= 0 ? "+" : ""}{dashStats.roi || 0}%
                    </div>
                    <div className="text-gray-500 text-xs">Return on Investment</div>
                  </div>

                  {/* P&L BAR CHART - Daily/Per-pick P&L */}
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-3 font-bold text-center">P&L Per Ticket</div>
                    <div className="flex items-end justify-center gap-1 h-40">
                      {dashPicks.filter((p: any) => p.status === "win" || p.status === "loss").slice(0, 15).map((pick: any, i: number) => {
                        const pnl = pick.status === "win" ? (pick.payout - pick.stake) : -pick.stake;
                        const maxPnl = 2000;
                        const height = Math.min(Math.abs(pnl) / maxPnl * 100, 100);
                        return (
                          <div key={i} className="flex flex-col items-center gap-1" style={{ width: "18px" }}>
                            {pnl >= 0 ? (
                              <>
                                <div className="bg-green-500 rounded-t w-full transition-all" style={{ height: `${height}%`, minHeight: "4px" }} />
                                <div className="text-[8px] text-green-400 font-bold">+${Math.abs(Math.round(pnl))}</div>
                              </>
                            ) : (
                              <>
                                <div className="text-[8px] text-red-400 font-bold">-${Math.abs(Math.round(pnl))}</div>
                                <div className="bg-red-500 rounded-b w-full transition-all" style={{ height: `${height}%`, minHeight: "4px" }} />
                              </>
                            )}
                          </div>
                        );
                      })}
                      {dashPicks.filter((p: any) => p.status === "win" || p.status === "loss").length === 0 && (
                        <div className="text-gray-600 text-xs text-center py-12">Results appear as tickets settle</div>
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <span className={`text-xl font-black ${(dashStats.netGain || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {(dashStats.netGain || 0) >= 0 ? "+" : ""}${(dashStats.netGain || 0).toLocaleString()}
                      </span>
                      <div className="text-gray-500 text-xs">Cumulative P&L</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bankroll Tracker */}
              {dashStats && (
                <div className="bg-gradient-to-r from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-2xl p-6 mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Starting Bankroll</div>
                      <div className="text-white font-black text-2xl">$10,000</div>
                    </div>
                    <div className="text-3xl text-gray-600">&#8594;</div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Total at Risk</div>
                      <div className="text-[#FF8900] font-black text-2xl">${(dashStats.allWagered || dashStats.pendingWagered || 0).toLocaleString()}</div>
                    </div>
                    <div className="text-3xl text-gray-600">&#8594;</div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Settled P&L</div>
                      <div className={`font-black text-2xl ${(dashStats.netGain || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {(dashStats.netGain || 0) >= 0 ? "+" : ""}${(dashStats.netGain || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-3xl text-gray-600">&#8594;</div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Current Bankroll</div>
                      <div className="text-white font-black text-2xl">${(10000 + (dashStats.netGain || 0)).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sport Breakdown */}
              {dashStats && dashStats.sportStats && Object.keys(dashStats.sportStats).length > 0 && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5 mb-8">
                  <h3 className="text-white font-bold text-sm mb-4">Performance by Sport</h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(dashStats.sportStats).map(([sport, s]: [string, any]) => {
                      const total = s.wins + s.losses + s.pushes;
                      const wp = total > 0 ? Math.round((s.wins / total) * 100) : 0;
                      const net = s.returned - s.wagered;
                      return (
                        <div key={sport} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold text-sm">{sport}</span>
                            <span className={`text-xs font-bold ${wp >= 55 ? "text-green-400" : wp >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                              {wp}%
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs">
                            {s.wins}W - {s.losses}L{s.pushes > 0 ? ` - ${s.pushes}P` : ""}
                          </div>
                          <div className={`text-sm font-bold mt-1 ${net >= 0 ? "text-green-400" : "text-red-400"}`}>
                            {net >= 0 ? "+" : ""}${Math.abs(Math.round(net * 100) / 100)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Picks List */}
          <section className="py-8 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white">Pick History</h2>
                <div className="flex gap-2">
                  {["all", "pending", "win", "loss"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setPickFilter(f)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        pickFilter === f
                          ? "bg-purple-600 text-white"
                          : "bg-[#1a1a1a] text-gray-500 hover:text-white border border-white/5"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {dashLoading ? (
                <div className="text-center py-12 text-gray-500">Loading picks...</div>
              ) : dashPicks.length === 0 ? (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-4">&#x1F3AF;</div>
                  <h3 className="text-xl font-black text-white mb-2">No Picks Yet</h3>
                  <p className="text-gray-500 mb-6">Start logging your picks to track your performance.</p>
                  <button
                    onClick={() => setShowAddPick(true)}
                    className="bg-purple-600 text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                  >
                    Log Your First Pick
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {dashPicks.map((pick: any, i: number) => (
                    <div
                      key={pick._id || i}
                      className={`bg-[#111] border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3 transition-all ${
                        pick.status === "win"
                          ? "border-green-500/20"
                          : pick.status === "loss"
                          ? "border-red-500/20"
                          : pick.status === "push"
                          ? "border-yellow-500/20"
                          : "border-white/5"
                      }`}
                    >
                      {/* Status badge */}
                      <div className="w-16">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            pick.status === "win"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : pick.status === "loss"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : pick.status === "push"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          }`}
                        >
                          {pick.status}
                        </span>
                      </div>

                      {/* Game + Pick */}
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{pick.game}</div>
                        <div className="text-gray-400 text-xs">
                          {pick.pick} ({pick.pickType}) | {pick.sport}
                        </div>
                      </div>

                      {/* Odds + Stake */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-gray-500 text-[10px] uppercase">Odds</div>
                          <div className="text-white font-mono text-sm">{pick.odds > 0 ? `+${pick.odds}` : pick.odds}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 text-[10px] uppercase">Stake</div>
                          <div className="text-white font-mono text-sm">${pick.stake}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-500 text-[10px] uppercase">
                            {pick.status === "win" ? "Won" : pick.status === "loss" ? "Lost" : "To Win"}
                          </div>
                          <div className={`font-mono text-sm font-bold ${
                            pick.status === "win" ? "text-green-400" : pick.status === "loss" ? "text-red-400" : "text-gray-300"
                          }`}>
                            {pick.status === "win"
                              ? `+$${(pick.payout - pick.stake).toFixed(2)}`
                              : pick.status === "loss"
                              ? `-$${pick.stake}`
                              : `$${(pick.potentialPayout - pick.stake).toFixed(2)}`}
                          </div>
                        </div>
                      </div>

                      {/* Settle buttons for pending */}
                      {pick.status === "pending" && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => settlePick(pick._id, "win")}
                            className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-500/30 transition-all"
                          >
                            WIN
                          </button>
                          <button
                            onClick={() => settlePick(pick._id, "loss")}
                            className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all"
                          >
                            LOSS
                          </button>
                          <button
                            onClick={() => settlePick(pick._id, "push")}
                            className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-500/30 transition-all"
                          >
                            PUSH
                          </button>
                        </div>
                      )}

                      {/* Date */}
                      <div className="text-gray-600 text-xs min-w-[80px] text-right">
                        {new Date(pick.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Add Pick Modal */}
          {showAddPick && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowAddPick(false)}>
              <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-black text-white mb-6">Log a Pick</h3>
                <form onSubmit={handleAddPick} className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase block mb-1.5">Game *</label>
                    <input
                      type="text"
                      required
                      value={pickForm.game}
                      onChange={(e) => setPickForm({ ...pickForm, game: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Michigan -12.5 vs Saint Louis"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase block mb-1.5">Sport</label>
                      <select
                        value={pickForm.sport}
                        onChange={(e) => setPickForm({ ...pickForm, sport: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="NCAAB">NCAAB (March Madness)</option>
                        <option value="NFL">NFL</option>
                        <option value="NBA">NBA</option>
                        <option value="MLB">MLB</option>
                        <option value="NHL">NHL</option>
                        <option value="UFC">UFC / MMA</option>
                        <option value="Soccer">Soccer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs uppercase block mb-1.5">Bet Type</label>
                      <select
                        value={pickForm.pickType}
                        onChange={(e) => setPickForm({ ...pickForm, pickType: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="spread">Spread</option>
                        <option value="moneyline">Moneyline</option>
                        <option value="total">Over/Under</option>
                        <option value="prop">Prop</option>
                        <option value="parlay">Parlay</option>
                        <option value="teaser">Teaser</option>
                        <option value="future">Future</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase block mb-1.5">Your Pick *</label>
                    <input
                      type="text"
                      required
                      value={pickForm.pick}
                      onChange={(e) => setPickForm({ ...pickForm, pick: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Michigan -12.5, Over 161.5, Louisville ML"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-xs uppercase block mb-1.5">Odds (American) *</label>
                      <input
                        type="text"
                        required
                        value={pickForm.odds}
                        onChange={(e) => setPickForm({ ...pickForm, odds: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-purple-500 focus:outline-none"
                        placeholder="-110"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs uppercase block mb-1.5">Stake ($) * <span className="text-purple-400">$1K - $5K</span></label>
                      <input
                        type="number"
                        required
                        min={1000}
                        max={5000}
                        step={100}
                        value={pickForm.stake}
                        onChange={(e) => setPickForm({ ...pickForm, stake: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-purple-500 focus:outline-none"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase block mb-1.5">Notes</label>
                    <input
                      type="text"
                      value={pickForm.notes}
                      onChange={(e) => setPickForm({ ...pickForm, notes: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      placeholder="BPI divergence play, 11-seed ATS trend, etc."
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all uppercase tracking-wider"
                    >
                      Log Pick
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
        </>
      )}

      {/* ================================================================
          TICKETS TAB
          ================================================================ */}
      {pageTab === "tickets" && (
        <>
          <section className="relative overflow-hidden pt-12 pb-8 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a1a0a] to-black" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[120px]" />
            <div className="relative max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live Bet Tickets -- {tickets.length} Active</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="text-lg mr-2">&#x1F3AB;</span>
                MY <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">TICKETS</span>
              </h1>

              {/* Stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Total at Risk</div>
                  <div className="text-white font-black text-3xl">${(ticketStats.allWagered || ticketStats.pendingWagered || 0).toLocaleString()}</div>
                  <div className="text-gray-600 text-xs mt-1">{ticketStats.pending || 0} pending / {ticketStats.settled || 0} settled</div>
                </div>
                <div className="bg-[#111] border border-green-500/10 rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Max Payout</div>
                  <div className="text-green-400 font-black text-3xl">
                    ${(ticketStats.pendingPotential || tickets.reduce((sum: number, t: any) => sum + (t.potentialPayout || 0), 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-green-600 text-xs mt-1">if all {ticketStats.pending || 0} picks hit</div>
                </div>
                <div className="bg-[#111] border border-[#FF8900]/10 rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Max Profit</div>
                  <div className="text-[#FF8900] font-black text-3xl">
                    +${((ticketStats.pendingPotential || 0) - (ticketStats.pendingWagered || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-gray-600 text-xs mt-1">ROI: {((((ticketStats.pendingPotential || 0) - (ticketStats.pendingWagered || 0)) / (ticketStats.pendingWagered || 1)) * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Record</div>
                  <div className="text-white font-black text-xl">{ticketStats.wins || 0}W - {ticketStats.losses || 0}L - {ticketStats.pushes || 0}P</div>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Win Rate</div>
                  <div className={`font-black text-xl ${(ticketStats.winPct || 0) >= 55 ? "text-green-400" : (ticketStats.winPct || 0) >= 45 ? "text-yellow-400" : ticketStats.settled > 0 ? "text-red-400" : "text-gray-500"}`}>
                    {ticketStats.settled > 0 ? `${ticketStats.winPct}%` : "--"}
                  </div>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Net P&L</div>
                  <div className={`font-black text-xl ${(ticketStats.netGain || 0) > 0 ? "text-green-400" : (ticketStats.netGain || 0) < 0 ? "text-red-400" : "text-gray-500"}`}>
                    {ticketStats.settled > 0 ? `${ticketStats.netGain >= 0 ? "+" : ""}$${ticketStats.netGain.toLocaleString()}` : "--"}
                  </div>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">Streak</div>
                  <div className={`font-black text-xl ${ticketStats.streak?.includes("W") ? "text-green-400" : ticketStats.streak?.includes("L") ? "text-red-400" : "text-gray-500"}`}>
                    {ticketStats.streak || "--"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 px-4 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto space-y-4">

              {ticketsLoading && <div className="text-center py-12 text-gray-500">Loading tickets...</div>}

              {!ticketsLoading && tickets.length === 0 && (
                <div className="text-center py-12 text-gray-500">No tickets yet. Lock in your first pick from the Picks Pending tab.</div>
              )}

              {tickets.map((ticket: any, i: number) => {
                const isThinking = ticket.status === "thinking";
                const isPlaced = ticket.status === "placed";
                const isWin = ticket.status === "win";
                const isLoss = ticket.status === "loss";
                const isPush = ticket.status === "push";

                const statusColor = isThinking ? "border-purple-500/30 bg-purple-500/5" : isPlaced ? "border-[#FF8900]/30 bg-[#FF8900]/5" : isWin ? "border-green-500/30 bg-green-500/5" : isLoss ? "border-red-500/30 bg-red-500/5" : "border-gray-500/30 bg-gray-500/5";
                const statusBadge = isThinking ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : isPlaced ? "bg-[#FF8900]/20 text-[#FF8900] border-[#FF8900]/30" : isWin ? "bg-green-500/20 text-green-400 border-green-500/30" : isLoss ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30";
                const statusText = isThinking ? "THINKING" : isPlaced ? "PLACED" : isWin ? "WIN" : isLoss ? "LOSS" : isPush ? "PUSH" : ticket.status?.toUpperCase() || "UNKNOWN";

                const createdDate = ticket.createdAt ? new Date(ticket.createdAt) : null;
                const timeStr = createdDate ? createdDate.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }) : "";

                return (
                  <div key={ticket._id || i} className={`border-2 rounded-2xl overflow-hidden transition-all ${statusColor}`}>
                    {/* Ticket header - perforated edge look */}
                    <div className="bg-[#111] px-6 py-4 border-b border-dashed border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 font-mono text-xs">#{String(i + 1).padStart(3, "0")}</span>
                          <span className="text-white font-black text-lg">{ticket.sport || "NCAAB"}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>{statusText}</span>
                        </div>
                        <div className="text-gray-500 text-xs font-mono">{timeStr}</div>
                      </div>
                    </div>

                    {/* Ticket body */}
                    <div className="bg-[#0d0d0d] px-6 py-5">
                      <div className="mb-4">
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Game</div>
                        <div className="text-white font-bold text-lg">{ticket.game}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Pick</div>
                          <div className="text-green-400 font-black text-lg">{ticket.pick}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Odds</div>
                          <div className="text-white font-mono font-bold text-lg">{ticket.odds > 0 ? `+${ticket.odds}` : ticket.odds}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Stake</div>
                          <div className="text-white font-black text-lg">${(ticket.stake || 0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{(isPlaced || isThinking) ? "To Win" : "Payout"}</div>
                          <div className={`font-black text-lg ${isWin ? "text-green-400" : isLoss ? "text-red-400" : isPlaced ? "text-[#FF8900]" : "text-purple-400"}`}>
                            {(isPlaced || isThinking) ? `$${((ticket.potentialPayout || 0) - (ticket.stake || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}` :
                             isWin ? `+$${((ticket.payout || 0) - (ticket.stake || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}` :
                             isLoss ? `-$${(ticket.stake || 0).toLocaleString()}` :
                             "$0"}
                          </div>
                        </div>
                      </div>

                      {ticket.notes && (
                        <div className="bg-[#1a1a1a] rounded-xl p-3 mt-3">
                          <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Analysis</div>
                          <div className="text-gray-400 text-sm">{ticket.notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Ticket footer - total payout */}
                    <div className="bg-[#111] px-6 py-3 border-t border-dashed border-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-xs">Type:</span>
                        <span className="text-gray-400 text-xs font-bold uppercase">{ticket.pickType || "Spread"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-xs">Potential Payout:</span>
                        <span className="text-green-400 font-mono font-bold">${(ticket.potentialPayout || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </section>
        </>
      )}

      {/* ================================================================
          OVER/UNDER TAB
          ================================================================ */}
      {pageTab === "overunder" && (
        <>
          <section className="relative overflow-hidden pt-12 pb-8 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a2e] to-black" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[120px]" />
            <div className="relative max-w-6xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                <span className="text-[#8B5CF6] text-xs font-bold uppercase tracking-wider">Live Totals -- All Sports</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                BEST <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">OVER/UNDERS</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                Real-time totals across every sport. Click a category to load live lines from DraftKings, FanDuel, and BetMGM.
              </p>
            </div>
          </section>

          <section className="py-6 px-4 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              {/* Sport category tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {OU_SPORTS.map((s) => {
                  const colorMap: Record<string, string> = {
                    green: ouSport === s.key ? "bg-green-600 text-white" : "bg-[#1a1a1a] text-gray-400 border border-white/5 hover:text-white",
                    orange: ouSport === s.key ? "bg-[#FF8900] text-black" : "bg-[#1a1a1a] text-gray-400 border border-white/5 hover:text-white",
                    blue: ouSport === s.key ? "bg-blue-600 text-white" : "bg-[#1a1a1a] text-gray-400 border border-white/5 hover:text-white",
                    red: ouSport === s.key ? "bg-red-600 text-white" : "bg-[#1a1a1a] text-gray-400 border border-white/5 hover:text-white",
                    purple: ouSport === s.key ? "bg-purple-600 text-white" : "bg-[#1a1a1a] text-gray-400 border border-white/5 hover:text-white",
                  };
                  return (
                    <button
                      key={s.key}
                      onClick={() => fetchOU(s.key)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${colorMap[s.color]}`}
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {ouLoading && <div className="text-center py-12 text-gray-500">Loading live totals...</div>}

              {!ouLoading && ouData[ouSport] && (() => {
                const games = ouData[ouSport];
                // Parse all games with totals
                const parsed = games.map((game: any) => {
                  const bookmakers = game.bookmakers || [];
                  const getTotal = (bk: any) => {
                    if (!bk) return null;
                    const m = bk.markets?.find((x: any) => x.key === "totals");
                    if (!m) return null;
                    const over = m.outcomes?.find((o: any) => o.name === "Over");
                    const under = m.outcomes?.find((o: any) => o.name === "Under");
                    return over && under ? { over: over.point, overPrice: over.price, under: under.point, underPrice: under.price } : null;
                  };
                  const dk = bookmakers.find((b: any) => b.key === "draftkings");
                  const fd = bookmakers.find((b: any) => b.key === "fanduel");
                  const mgm = bookmakers.find((b: any) => b.key === "betmgm");
                  const dkT = getTotal(dk);
                  const fdT = getTotal(fd);
                  const mgmT = getTotal(mgm);
                  const primary = dkT || fdT || mgmT;
                  if (!primary) return null;

                  // Calculate juice differential (which side the books are shading)
                  const overJuice = dkT?.overPrice || 0;
                  const underJuice = dkT?.underPrice || 0;
                  const juiceDiff = overJuice - underJuice; // positive = under is juiced (books expect lower scoring)
                  const edge = Math.abs(juiceDiff);

                  const gameTime = new Date(game.commence_time);
                  return {
                    id: game.id,
                    home: game.home_team,
                    away: game.away_team,
                    total: primary.over,
                    overPrice: dkT?.overPrice || primary.overPrice,
                    underPrice: dkT?.underPrice || primary.underPrice,
                    dkTotal: dkT?.over,
                    fdTotal: fdT?.over,
                    mgmTotal: mgmT?.over,
                    dkOver: dkT?.overPrice,
                    dkUnder: dkT?.underPrice,
                    fdOver: fdT?.overPrice,
                    fdUnder: fdT?.underPrice,
                    mgmOver: mgmT?.overPrice,
                    mgmUnder: mgmT?.underPrice,
                    juiceDiff,
                    edge,
                    time: gameTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }),
                    date: gameTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/Chicago" }),
                  };
                }).filter(Boolean).sort((a: any, b: any) => b.edge - a.edge);

                return (
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="hidden md:flex items-center px-4 py-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                      <div className="flex-1">Matchup</div>
                      <div className="w-20 text-center">Total</div>
                      <div className="w-24 text-center">Over</div>
                      <div className="w-24 text-center">Under</div>
                      <div className="w-16 text-center">DK</div>
                      <div className="w-16 text-center">FD</div>
                      <div className="w-16 text-center">MGM</div>
                      <div className="w-24 text-center">Edge</div>
                      <div className="w-20 text-right">Time</div>
                    </div>

                    {parsed.slice(0, 25).map((g: any, i: number) => {
                      const isOver = g.juiceDiff > 3;
                      const isUnder = g.juiceDiff < -3;
                      const lean = isOver ? "OVER" : isUnder ? "UNDER" : "EVEN";
                      const leanColor = isOver ? "text-green-400" : isUnder ? "text-red-400" : "text-gray-400";
                      const leanBg = isOver ? "bg-green-500/10 border-green-500/20" : isUnder ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/5";
                      const rankBg = i < 3 ? "bg-[#8B5CF6] text-white" : i < 10 ? "bg-white/10 text-gray-300" : "bg-white/5 text-gray-500";

                      return (
                        <div key={g.id || i} className={`border rounded-xl p-4 transition-all hover:border-[#8B5CF6]/30 ${i < 5 ? "bg-[#111] border-[#8B5CF6]/20" : "bg-[#111] border-white/5"}`}>
                          <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                              <span className={`text-xs font-black px-2 py-1 rounded-lg ${rankBg}`}>#{i + 1}</span>
                              <div>
                                <div className="text-white text-sm font-medium">{g.away}</div>
                                <div className="text-gray-400 text-xs">@ {g.home}</div>
                              </div>
                            </div>

                            <div className="w-20 text-center">
                              <div className="text-white font-mono font-black text-lg">{g.total}</div>
                            </div>

                            <div className="w-24 text-center">
                              <div className={`font-mono text-sm ${g.overPrice > g.underPrice ? "text-green-400 font-bold" : "text-gray-400"}`}>
                                O {g.overPrice > 0 ? `+${g.overPrice}` : g.overPrice}
                              </div>
                            </div>
                            <div className="w-24 text-center">
                              <div className={`font-mono text-sm ${g.underPrice > g.overPrice ? "text-red-400 font-bold" : "text-gray-400"}`}>
                                U {g.underPrice > 0 ? `+${g.underPrice}` : g.underPrice}
                              </div>
                            </div>

                            <div className="w-16 text-center">
                              <div className="text-green-400 text-[10px] font-bold">DK</div>
                              <div className="text-white font-mono text-xs">{g.dkTotal || "--"}</div>
                            </div>
                            <div className="w-16 text-center">
                              <div className="text-blue-400 text-[10px] font-bold">FD</div>
                              <div className="text-white font-mono text-xs">{g.fdTotal || "--"}</div>
                            </div>
                            <div className="w-16 text-center">
                              <div className="text-yellow-400 text-[10px] font-bold">MGM</div>
                              <div className="text-white font-mono text-xs">{g.mgmTotal || "--"}</div>
                            </div>

                            <div className="w-24 text-center">
                              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold border ${leanBg} ${leanColor}`}>
                                {lean} {g.edge > 0 ? `(${g.edge})` : ""}
                              </span>
                            </div>

                            <div className="w-20 text-right">
                              <div className="text-[#8B5CF6] font-bold text-sm">{g.time}</div>
                              <div className="text-gray-500 text-xs">{g.date}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {parsed.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        No totals available for this sport right now. Games may not have started or lines are not posted yet.
                      </div>
                    )}
                  </div>
                );
              })()}

              {!ouLoading && !ouData[ouSport] && (
                <div className="text-center py-12 text-gray-500">Click a sport above to load live over/under lines.</div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ================================================================
          PICKS PENDING TAB
          ================================================================ */}
      {pageTab === "picks" && (
        <>
          <section className="relative overflow-hidden pt-12 pb-8 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a00] to-black" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF8900]/5 rounded-full blur-[120px]" />
            <div className="relative max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#FF8900]/10 border border-[#FF8900]/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
                <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">March Madness Round 2 -- Games Today</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="text-lg mr-2">&#x1F3AF;</span>
                TOP 5 <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">PICKS</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mb-2">
                Data-driven selections based on BPI model divergence, historical seed ATS trends,
                and sharp money indicators. $1K-$5K per play.
              </p>
            </div>
          </section>

          <section className="py-8 px-4 bg-[#0a0a0a]">
            <div className="max-w-4xl mx-auto space-y-6">

              {/* PICK 1 */}
              <div className="bg-[#111] border-2 border-[#FF8900]/30 rounded-2xl p-6 shadow-lg shadow-[#FF8900]/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#FF8900] text-black text-sm font-black px-3 py-1 rounded-lg">#1</span>
                    <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">BEST BET</span>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-green-500/30">HIGH CONFIDENCE</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Louisville Cardinals +4.5 (-110)</h3>
                <p className="text-gray-500 text-sm mb-4">vs Michigan State Spartans | Sat 1:45 PM CT | Buffalo, NY</p>
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">BPI DIVERGENCE:</strong> ESPN BPI projects Louisville to win by 0.2 points (51% win probability). Michigan State is -4.5. The spread is nearly 5 points off the model -- the biggest BPI-spread gap of any Round 2 game.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">LIVE LINE:</strong> DraftKings ML: Louisville +170 / MSU -205. The moneyline implies only a 37% Louisville win probability, but BPI says 51%. That is massive value.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">HISTORY:</strong> 6-seeds are 46.4% ATS overall, but Louisville is battle-tested from the ACC (23-10, 11-7). MSU is strong but BPI says this is essentially a pick&apos;em.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-green-400">VERDICT:</strong> When BPI says a team should win and they&apos;re getting 4.5 points, you take it every time. This is the strongest edge on the board.</p>
                </div>
              </div>

              {/* PICK 2 */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-white text-sm font-black px-3 py-1 rounded-lg">#2</span>
                    <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">12-SEED ATS PLAY</span>
                  </div>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-lg border border-green-500/30">HIGH CONFIDENCE</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">High Point Panthers +11.5 (-110)</h3>
                <p className="text-gray-500 text-sm mb-4">vs Arkansas Razorbacks | Sat 8:45 PM CT | Portland, OR</p>
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">UPSET MOMENTUM:</strong> High Point just beat 5-seed Wisconsin 78-72 in Round 1. They are the Cinderella of this tournament and playing with house money.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">12-SEED HISTORY:</strong> 12-seeds cover the spread 53.9% of the time since 1985. That is a statistically significant edge over thousands of games. The market consistently overvalues higher seeds in this matchup.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">BPI CHECK:</strong> BPI says Arkansas by 8.2 (79%). The spread is 11.5. That is 3.3 points of cushion beyond the model projection.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-green-400">VERDICT:</strong> High Point doesn&apos;t need to win -- they just need to keep it within 11. A team that just knocked off Wisconsin has the confidence and skill to stay close. 30-4 record, 15-1 in conference. Take the points.</p>
                </div>
              </div>

              {/* PICK 3 */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-white text-sm font-black px-3 py-1 rounded-lg">#3</span>
                    <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">11-SEED ATS PLAY</span>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-lg border border-yellow-500/30">MEDIUM CONFIDENCE</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Texas Longhorns +6.5 (+210 ML)</h3>
                <p className="text-gray-500 text-sm mb-4">vs Gonzaga Bulldogs | Sat 6:10 PM CT | Portland, OR</p>
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">11-SEED EDGE:</strong> 11-seeds are the single most profitable seed in tournament history at 56.4% ATS. This is not a fluke -- it is the strongest historical trend in March Madness betting.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">TEXAS CONTEXT:</strong> Texas (18-14) looks bad on paper, but they just beat 6-seed BYU outright in Round 1. They are an SEC team with NBA-level talent that underperformed in the regular season. Tournament mode is different.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">BPI:</strong> Gonzaga by 6.8 (75%). Spread is 6.5 -- nearly aligned with BPI. This is close to fair value, but the 11-seed historical edge tips it.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-green-400">VERDICT:</strong> 56.4% ATS + major-conference talent getting 6.5 points. The math says take Texas.</p>
                </div>
              </div>

              {/* PICK 4 */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-white text-sm font-black px-3 py-1 rounded-lg">#4</span>
                    <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">FADE THE 2-SEED</span>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-lg border border-yellow-500/30">MEDIUM CONFIDENCE</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Kentucky Wildcats +4.5 (+180 ML)</h3>
                <p className="text-gray-500 text-sm mb-4">vs Iowa State Cyclones | Sun 1:45 PM CT | St. Louis</p>
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">FADE 2-SEEDS:</strong> 2-seeds have the worst ATS cover rate of any top-4 seed at 45.5%. The public consistently overvalues them. Iowa State is a 2-seed.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">INJURY FACTOR:</strong> Iowa State star Joshua Jefferson injured his ankle late in Round 1. Even if he plays, he won&apos;t be 100%. Watch for line movement -- if the line stays or moves toward Iowa State despite the injury, that is a trap.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">KENTUCKY MOMENTUM:</strong> Jaquan Oweh hit a half-court buzzer beater to force OT against Santa Clara. Won 89-84. This team has momentum and a chip on their shoulder as a 7-seed.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">BPI:</strong> Iowa State by 5.5 (71%). Spread is 4.5. Line is tighter than BPI suggests -- sharp money may already be on Kentucky.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-green-400">VERDICT:</strong> Fade the 2-seed, ride Kentucky momentum, and exploit the potential injury edge. Take Kentucky +4.5.</p>
                </div>
              </div>

              {/* PICK 5 */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-white/10 text-white text-sm font-black px-3 py-1 rounded-lg">#5</span>
                    <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">PICK&apos;EM VALUE</span>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-lg border border-yellow-500/30">MEDIUM CONFIDENCE</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1">Vanderbilt Commodores -1.5 (-125 ML)</h3>
                <p className="text-gray-500 text-sm mb-4">vs Nebraska Cornhuskers | Sat 7:45 PM CT | Oklahoma City</p>
                <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-2">
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">5 vs 4 UPSET SPOT:</strong> This is a 5-seed favored over a 4-seed. 5-seeds cover 51.0% ATS, and they upset 4-seeds 35.3% of the time. The line reflects this -- essentially a pick&apos;em.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">BPI:</strong> Vanderbilt by 0.8 (53%). Live line has Vandy -1.5 with ML at -125. This is about as close to a coin flip as it gets, but BPI gives Vandy the slight edge.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-[#FF8900]">SEC ADVANTAGE:</strong> Vanderbilt (26-7, 11-7 SEC) comes from the strongest conference in college basketball. SEC teams have been battle-tested all season against elite competition. Nebraska (26-6, 15-5 Big Ten) is strong but the SEC tournament experience is a tiebreaker in close games.</p>
                  <p className="text-gray-300 text-sm"><strong className="text-green-400">VERDICT:</strong> In a true coin-flip game, take the team from the better conference at a minimal spread. Vandy -1.5 is the play.</p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-[#FF8900]/10 to-[#DC2626]/10 border border-[#FF8900]/20 rounded-2xl p-6">
                <h3 className="text-xl font-black text-white mb-4">Pick Summary -- Bet Slip</h3>
                <div className="space-y-3">
                  {[
                    { pick: "Louisville +4.5", odds: "-110", stake: "$2,000", toWin: "$1,818", conf: "HIGH" },
                    { pick: "High Point +11.5", odds: "-110", stake: "$1,500", toWin: "$1,364", conf: "HIGH" },
                    { pick: "Texas +6.5", odds: "-110", stake: "$1,000", toWin: "$909", conf: "MED" },
                    { pick: "Kentucky +4.5", odds: "-110", stake: "$1,000", toWin: "$909", conf: "MED" },
                    { pick: "Vanderbilt -1.5", odds: "-110", stake: "$1,000", toWin: "$909", conf: "MED" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#111] rounded-xl px-4 py-3 border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[#FF8900] font-black">#{i + 1}</span>
                        <span className="text-white font-bold text-sm">{p.pick}</span>
                        <span className="text-gray-500 font-mono text-xs">{p.odds}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.conf === "HIGH" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"}`}>{p.conf}</span>
                        <div className="text-right">
                          <div className="text-white font-mono text-sm">{p.stake}</div>
                          <div className="text-green-400 font-mono text-xs">Win {p.toWin}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-xs uppercase">Total Risk</div>
                    <div className="text-white font-black text-2xl">$6,500</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-xs uppercase">Total Potential Profit</div>
                    <div className="text-green-400 font-black text-2xl">+$5,909</div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* ================================================================
          SPORTSBOOK TAB
          ================================================================ */}
      {pageTab === "sportsbook" && (
      <>

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,137,0,0.3) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,137,0,0.3) 50px)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF8900]/5 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <p className="text-[#DC2626] font-bold text-xs tracking-[0.4em] uppercase mb-4">
              DATA-DRIVEN SPORTS ANALYTICS
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">
              SPORTS BETTING
              <br />
              <span className="bg-gradient-to-r from-[#FF8900] to-[#DC2626] bg-clip-text text-transparent">
                INTELLIGENCE
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Real-time odds comparison, line movement tracking, arbitrage detection, and sharp money
              indicators -- all in one command center. Stop guessing. Start profiting.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-[#111]/80 backdrop-blur border border-white/5 rounded-2xl p-4">
            <StatCard value="70+" label="Sports Covered" icon="🏈" />
            <StatCard value="200+" label="Sportsbooks Tracked" icon="📊" />
            <StatCard value="<1s" label="Data Latency" icon="⚡" />
            <StatCard value="AI" label="Powered Analysis" icon="🧠" />
          </div>
        </div>
      </section>

      {/* ================================================================
          LIVE ODDS COMPARISON
          ================================================================ */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live Data</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Odds <span className="text-[#FF8900]">Comparison</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Side-by-side odds from DraftKings, FanDuel, BetMGM, and Caesars. Best price highlighted green.
          </p>

          {/* Sport Tabs */}
          <div className="flex gap-2 mb-4">
            {(["nfl", "nba", "mlb"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setOddsTab(s)}
                className={`px-5 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                  oddsTab === s
                    ? "bg-[#FF8900] text-black"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Market Tabs */}
          <div className="flex gap-2 mb-6">
            {([
              { key: "ml", label: "Moneyline" },
              { key: "spread", label: "Spread" },
              { key: "total", label: "Over/Under" },
            ] as const).map((m) => (
              <button
                key={m.key}
                onClick={() => setMarketTab(m.key)}
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                  marketTab === m.key
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Odds Table */}
          <div className="bg-[#111] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1a1a] border-b border-white/5">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase">Game</th>
                    <th className="text-left px-3 py-3 text-gray-500 font-medium text-xs uppercase">Time</th>
                    <th className="text-center px-3 py-3 text-xs uppercase">
                      <span className="text-green-400 font-bold">DraftKings</span>
                    </th>
                    <th className="text-center px-3 py-3 text-xs uppercase">
                      <span className="text-blue-400 font-bold">FanDuel</span>
                    </th>
                    <th className="text-center px-3 py-3 text-xs uppercase">
                      <span className="text-yellow-400 font-bold">BetMGM</span>
                    </th>
                    <th className="text-center px-3 py-3 text-xs uppercase">
                      <span className="text-purple-400 font-bold">Caesars</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentGames.map((game, i) => {
                    const books = ["dk", "fd", "mgm", "caesars"] as const;
                    let awayVals: number[], homeVals: number[];

                    if (marketTab === "ml") {
                      awayVals = books.map((b) => game[b].awayML);
                      homeVals = books.map((b) => game[b].homeML);
                    } else if (marketTab === "spread") {
                      awayVals = books.map((b) => game[b].spread);
                      homeVals = books.map((b) => -game[b].spread);
                    } else {
                      awayVals = books.map((b) => game[b].total);
                      homeVals = books.map((b) => game[b].total);
                    }

                    const bestAway = Math.max(...awayVals);
                    const bestHome = marketTab === "total" ? Math.max(...homeVals) : Math.max(...homeVals);

                    return (
                      <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? "bg-[#111]" : "bg-[#0d0d0d]"} hover:bg-[#1a1a1a] transition-colors`}>
                        <td className="px-4 py-3">
                          <div className="text-white font-medium text-xs">{game.away}</div>
                          <div className="text-gray-400 text-xs mt-1">@ {game.home}</div>
                        </td>
                        <td className="px-3 py-3 text-gray-500 text-xs">{game.time}</td>
                        {books.map((book, bi) => (
                          <td key={book} className="text-center px-3 py-3">
                            <div className="space-y-1">
                              <div>
                                <OddsCell
                                  value={marketTab === "ml" ? game[book].awayML : marketTab === "spread" ? game[book].spread : game[book].total}
                                  best={awayVals[bi] === bestAway}
                                />
                              </div>
                              {marketTab !== "total" && (
                                <div>
                                  <OddsCell
                                    value={marketTab === "ml" ? game[book].homeML : -game[book].spread}
                                    best={homeVals[bi] === bestHome}
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          LINE MOVEMENT TRACKER
          ================================================================ */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Line Movement <span className="text-[#FF8900]">Tracker</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Track how lines move from open to current. Reverse line movement signals sharp action.
          </p>

          <div className="grid gap-3">
            {LINE_MOVEMENTS.map((lm, i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-[#FF8900]/20 transition-all"
              >
                <div className="flex-1 min-w-[200px]">
                  <div className="text-white font-bold text-sm">{lm.game}</div>
                  {lm.sharp && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FF8900]/20 text-[#FF8900] border border-[#FF8900]/30">
                      Sharp Action
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 flex-1">
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase">Open</div>
                    <div className="text-white font-mono font-bold">{lm.open > 0 ? `+${lm.open}` : lm.open}</div>
                  </div>

                  {/* Visual line movement bar */}
                  <div className="flex-1 relative h-6">
                    <div className="absolute inset-0 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-1/2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.abs(lm.move) * 20}%`,
                          backgroundColor: lm.move < 0 ? "#22c55e" : "#ef4444",
                          transform: lm.move < 0 ? "translateX(-100%)" : "translateX(0)",
                        }}
                      />
                    </div>
                    <div className="absolute inset-y-0 left-1/2 w-px bg-gray-600" />
                  </div>

                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase">Current</div>
                    <div className="text-white font-mono font-bold">{lm.current > 0 ? `+${lm.current}` : lm.current}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center px-3">
                    <div className="text-gray-500 text-[10px] uppercase">Public</div>
                    <div className="text-white font-mono text-sm">{lm.pctPublic}%</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-gray-500 text-[10px] uppercase">Sharp</div>
                    <div className="text-[#FF8900] font-mono text-sm font-bold">{lm.pctSharp}%</div>
                  </div>
                  <div className={`text-sm font-bold ${lm.move < 0 ? "text-green-400" : "text-red-400"}`}>
                    {lm.move > 0 ? `+${lm.move}` : lm.move}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          ARBITRAGE SCANNER
          ================================================================ */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#FF8900] animate-pulse" />
            <span className="text-[#FF8900] text-xs font-bold uppercase tracking-wider">Scanning 200+ Books</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Arbitrage <span className="text-[#FF8900]">Scanner</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Real-time detection of price discrepancies across sportsbooks. Guaranteed profit opportunities.
          </p>

          <div className="grid gap-3">
            {ARBITRAGE_OPPS.map((arb, i) => (
              <div
                key={i}
                className={`bg-[#111] border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-500 ${
                  i === pulseIdx ? "border-[#FF8900]/40 shadow-lg shadow-[#FF8900]/10" : "border-white/5"
                }`}
              >
                <div className="flex items-center gap-3 min-w-[100px]">
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10">
                    {arb.sport}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{arb.game}</div>
                  <div className="text-gray-500 text-xs">{arb.market}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase">Edge</div>
                    <div className="text-green-400 font-mono font-bold">{arb.edge}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase">Books</div>
                    <div className="text-white text-xs">{arb.book1} / {arb.book2}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[10px] uppercase">ROI</div>
                    <div className="text-[#FF8900] font-mono font-bold">{arb.roi}</div>
                  </div>
                </div>
                {/* Blurred stake calculator */}
                <div className="relative">
                  <div className="bg-[#1a1a1a] rounded-lg px-4 py-2 blur-sm select-none">
                    <div className="text-xs text-gray-400">Stake: $500 → $512.30</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#FF8900] bg-black/80 px-2 py-0.5 rounded">LOCKED</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PUBLIC BETTING + SHARP MONEY
          ================================================================ */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Public Betting Percentages */}
          <div>
            <h2 className="text-2xl font-black mb-2">
              Public Betting <span className="text-[#FF8900]">%</span>
            </h2>
            <p className="text-gray-500 text-sm mb-6">Where the public money is going</p>
            <div className="space-y-4">
              {PUBLIC_BETS.map((pb, i) => (
                <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-sm font-medium">{pb.game}</span>
                    {pb.rlm && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        RLM
                      </span>
                    )}
                  </div>
                  <div className="relative h-6 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF8900] to-[#FF8900]/60 rounded-full transition-all duration-1000"
                      style={{ width: `${pb.publicPct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-3">
                      <span className="text-[10px] font-bold text-white drop-shadow">{pb.side} {pb.publicPct}%</span>
                      <span className="text-[10px] font-bold text-gray-300 drop-shadow">{100 - pb.publicPct}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Sharp side: <span className={`font-bold ${pb.sharpSide !== pb.side ? "text-green-400" : "text-gray-400"}`}>{pb.sharpSide}</span>
                    {pb.sharpSide !== pb.side && " (contrarian)"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharp Money Indicators */}
          <div>
            <h2 className="text-2xl font-black mb-2">
              Sharp Money <span className="text-[#DC2626]">Alerts</span>
            </h2>
            <p className="text-gray-500 text-sm mb-6">Professional bettor activity detected</p>
            <div className="space-y-3">
              {SHARP_INDICATORS.map((si, i) => (
                <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-4 hover:border-[#DC2626]/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-bold">{si.game}</span>
                    <SeverityBadge level={si.severity} />
                  </div>
                  <div className="text-[#FF8900] text-xs font-bold uppercase mb-1">{si.indicator}</div>
                  <div className="text-gray-400 text-xs">{si.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          BANKROLL CALCULATOR (Teaser)
          ================================================================ */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-2">
            Kelly Criterion <span className="text-[#FF8900]">Calculator</span>
          </h2>
          <p className="text-gray-500 mb-8">Optimal bet sizing based on your edge and bankroll</p>

          <div className="bg-[#111] border border-white/5 rounded-xl p-6 relative overflow-hidden">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-gray-400 text-xs uppercase block mb-2">Your Bankroll</label>
                <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 text-white font-mono border border-white/10">$10,000</div>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase block mb-2">Win Probability</label>
                <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 text-white font-mono border border-white/10">55%</div>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase block mb-2">Decimal Odds</label>
                <div className="bg-[#1a1a1a] rounded-lg px-4 py-3 text-white font-mono border border-white/10">2.10</div>
              </div>
            </div>

            {/* Blurred results */}
            <div className="relative">
              <div className="grid md:grid-cols-4 gap-4 blur-md select-none pointer-events-none">
                <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-xs uppercase">Full Kelly</div>
                  <div className="text-2xl font-black text-green-400">$1,045</div>
                  <div className="text-gray-600 text-xs">10.45% of bankroll</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-xs uppercase">Half Kelly</div>
                  <div className="text-2xl font-black text-[#FF8900]">$523</div>
                  <div className="text-gray-600 text-xs">5.23% of bankroll</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-xs uppercase">Quarter Kelly</div>
                  <div className="text-2xl font-black text-blue-400">$261</div>
                  <div className="text-gray-600 text-xs">2.61% of bankroll</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
                  <div className="text-gray-500 text-xs uppercase">Expected Value</div>
                  <div className="text-2xl font-black text-white">+$55</div>
                  <div className="text-gray-600 text-xs">per bet at full Kelly</div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/80 border border-[#FF8900]/30 rounded-xl px-6 py-3">
                  <span className="text-[#FF8900] font-bold text-sm">UNLOCK BELOW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          DATA PIPELINE / API SOURCES
          ================================================================ */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Our Data <span className="text-[#FF8900]">Pipeline</span>
          </h2>
          <p className="text-gray-500 mb-10">
            Aggregating odds, scores, and analytics from the best data providers in the industry
          </p>

          {/* Free APIs */}
          <h3 className="text-xl font-black mb-4 text-white">
            <span className="text-green-400 mr-2">&#10003;</span> Active Free Data Sources
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { name: "The Odds API", desc: "70+ sports, 40+ books, real-time odds", tier: "500 req/mo free" },
              { name: "API-Sports", desc: "Football, NBA, NFL, MLB, Hockey stats", tier: "100 req/day free" },
              { name: "BetFair Exchange", desc: "Exchange odds, 30+ sports, unlimited", tier: "Free (1-180s delay)" },
              { name: "SportsGameOdds", desc: "Live odds, props, 80+ bookmakers", tier: "1,000 obj/mo free" },
            ].map((api, i) => (
              <div key={i} className="bg-[#111] border border-green-500/20 rounded-xl p-5 hover:border-green-500/40 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-xs">&#10003;</span>
                  </div>
                  <span className="text-white font-bold text-sm">{api.name}</span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{api.desc}</p>
                <span className="text-green-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                  {api.tier}
                </span>
              </div>
            ))}
          </div>

          {/* Premium APIs */}
          <h3 className="text-xl font-black mb-4 text-white">
            <span className="text-[#FF8900] mr-2">&#9733;</span> Premium API Pricing
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "The Odds API", price: "$30 - $249/mo", features: "20K-15M credits, all sports & books, historical odds", best: "Best value starter" },
              { name: "SportsDataIO", price: "$599/mo", features: "All US sports, projections, DFS, live scores, player stats", best: "Best for US sports" },
              { name: "Sportradar", price: "$500 - $2,000+/mo", features: "80+ sports, 150+ books, official league data, enterprise SLA", best: "Enterprise grade" },
              { name: "OpticOdds", price: "Custom ($300+/mo)", features: "200+ sportsbooks, sub-second latency, streaming, props", best: "Best for speed" },
              { name: "OddsJam", price: "$500 - $1,000+/mo", features: "Sharp tools, arb scanner, EV finder, 100+ books", best: "Best for sharps" },
              { name: "SportsGameOdds", price: "$99 - $499/mo", features: "All markets + props, 80+ books, scores, 30-60s refresh", best: "Best mid-tier" },
              { name: "Genius Sports", price: "Enterprise", features: "Official league data, 40+ sports, 600K+ events, trading tools", best: "Official data" },
              { name: "Unabated", price: "Custom", features: "All markets, DFS pick'em, player props, alternate lines", best: "Best for props" },
            ].map((api, i) => (
              <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5 hover:border-[#FF8900]/20 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold text-sm">{api.name}</span>
                </div>
                <div className="text-[#FF8900] font-black text-lg mb-2">{api.price}</div>
                <p className="text-gray-400 text-xs mb-3">{api.features}</p>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FF8900]/10 text-[#FF8900] border border-[#FF8900]/20">
                  {api.best}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          LOCK GATE
          ================================================================ */}
      <section className="py-20 px-4 relative overflow-hidden" id="unlock">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF8900]/5 rounded-full blur-[150px]" />

        <div className="relative max-w-4xl mx-auto">
          {/* Blurred premium preview */}
          <div className="mb-12">
            <div className="grid md:grid-cols-3 gap-4 blur-sm select-none pointer-events-none opacity-60">
              {[
                { title: "Real-Time Arbitrage Alerts", desc: "Instant notifications when arb opportunities appear across 200+ books" },
                { title: "AI Prediction Models", desc: "Machine learning models trained on 10M+ historical games and outcomes" },
                { title: "Bankroll Optimizer Pro", desc: "Dynamic Kelly Criterion with risk-adjusted position sizing" },
                { title: "Sharp Money Live Feed", desc: "Real-time feed of professional bettor activity and steam moves" },
                { title: "Line Shopping Assistant", desc: "Automated best-price finder across every legal sportsbook" },
                { title: "Prop Bet Analyzer", desc: "Player prop edges using advanced statistical models and injury data" },
              ].map((card, i) => (
                <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5">
                  <div className="text-white font-bold text-sm mb-2">{card.title}</div>
                  <div className="text-gray-500 text-xs">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Form */}
          <div className="bg-[#111] border-2 border-[#FF8900]/30 rounded-2xl p-8 md:p-12 shadow-2xl shadow-[#FF8900]/10">
            <div className="text-center mb-8">
              <p className="text-[#DC2626] font-bold text-xs tracking-[0.3em] uppercase mb-3">EXCLUSIVE ACCESS</p>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                TAKE YOUR BETTING TO THE
                <br />
                <span className="text-[#FF8900]">NEXT LEVEL</span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Unlock advanced analytics, real-time arbitrage alerts, sharp money tracking,
                AI-powered predictions, and the full Kelly Criterion calculator.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">&#9989;</div>
                <h3 className="text-2xl font-black text-white mb-2">You&apos;re In.</h3>
                <p className="text-gray-400">
                  Check your email for access credentials. A member of our team will reach out within 24 hours
                  with your personalized betting strategy report.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                <div>
                  <label className="text-gray-400 text-xs uppercase block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-[#FF8900] focus:outline-none transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs uppercase block mb-1.5">Betting Experience</label>
                    <select
                      value={formData.bettingExperience}
                      onChange={(e) => setFormData({ ...formData, bettingExperience: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs uppercase block mb-1.5">Primary Sport</label>
                    <select
                      value={formData.primarySport}
                      onChange={(e) => setFormData({ ...formData, primarySport: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF8900] focus:outline-none transition-colors"
                    >
                      <option value="">Select sport</option>
                      <option value="NFL">NFL</option>
                      <option value="NBA">NBA</option>
                      <option value="MLB">MLB</option>
                      <option value="NHL">NHL</option>
                      <option value="UFC/MMA">UFC / MMA</option>
                      <option value="Soccer">Soccer</option>
                      <option value="College Football">College Football</option>
                      <option value="College Basketball">College Basketball</option>
                      <option value="Golf">Golf</option>
                      <option value="Tennis">Tennis</option>
                      <option value="All Sports">All Sports</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-black text-lg py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 uppercase tracking-wider mt-4"
                >
                  {submitting ? "Unlocking..." : "UNLOCK PREMIUM INTELLIGENCE"}
                </button>
                <p className="text-gray-600 text-xs text-center mt-3">
                  No credit card required. Your data is secure and never shared with third parties.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          BETTING STRATEGIES
          ================================================================ */}
      <section className="py-16 px-4 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            Betting Strategies <span className="text-[#FF8900]">We Track</span>
          </h2>
          <p className="text-gray-500 mb-10">
            Data-driven approaches to finding and exploiting edges in sports betting markets
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Value Betting", desc: "Find mispriced odds where the bookmaker's implied probability is lower than the true probability. Consistent +EV over thousands of bets.", icon: "&#x1F4B0;", color: "from-green-500/10 to-green-500/5" },
              { title: "Arbitrage", desc: "Exploit price differences between sportsbooks to lock in guaranteed profit regardless of outcome. Typical edges: 1-5% per opportunity.", icon: "&#x1F504;", color: "from-blue-500/10 to-blue-500/5" },
              { title: "Line Shopping", desc: "Compare odds across every legal book to always get the best price. Half-point differences compound into massive edge over time.", icon: "&#x1F6D2;", color: "from-purple-500/10 to-purple-500/5" },
              { title: "Bankroll Management", desc: "Kelly Criterion and fractional Kelly sizing to maximize growth while controlling risk of ruin. The math behind sustainable profitability.", icon: "&#x1F4CA;", color: "from-[#FF8900]/10 to-[#FF8900]/5" },
              { title: "Reverse Line Movement", desc: "When the line moves opposite to public money, sharp bettors are on the other side. Track RLM signals across every major market.", icon: "&#x21C4;", color: "from-red-500/10 to-red-500/5" },
              { title: "Prop Betting", desc: "Player-level edges using advanced stats, matchup analysis, injury data, and correlation models. Higher variance, higher ceiling.", icon: "&#x1F3AF;", color: "from-yellow-500/10 to-yellow-500/5" },
              { title: "Live / In-Play", desc: "Real-time edge detection during games using momentum shifts, pace analysis, and live model updates. Speed is everything.", icon: "&#x26A1;", color: "from-cyan-500/10 to-cyan-500/5" },
              { title: "Futures & Outrights", desc: "Long-term value bets on season outcomes, division winners, and championship odds. Early lines offer the biggest edges.", icon: "&#x1F52E;", color: "from-pink-500/10 to-pink-500/5" },
            ].map((strat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${strat.color} border border-white/5 rounded-xl p-5 hover:border-[#FF8900]/20 transition-all hover:-translate-y-1`}
              >
                <div className="text-2xl mb-3" dangerouslySetInnerHTML={{ __html: strat.icon }} />
                <h3 className="text-white font-bold text-sm mb-2">{strat.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{strat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ SECTION
          ================================================================ */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">
            Frequently Asked <span className="text-[#FF8900]">Questions</span>
          </h2>
          <div className="space-y-3">
            {[
              { q: "What is value betting?", a: "Value betting means placing wagers where the odds offered by the sportsbook are higher than the true probability of the outcome. By consistently finding and betting value, you gain a mathematical edge over the house." },
              { q: "How does arbitrage betting work?", a: "Arbitrage betting exploits price differences between sportsbooks. When two books disagree on odds enough, you can bet both sides and guarantee a profit regardless of outcome. Typical edges range from 1-5%." },
              { q: "What is the Kelly Criterion?", a: "The Kelly Criterion is a mathematical formula for optimal bet sizing. It calculates the ideal percentage of your bankroll to wager based on your edge and the odds offered, maximizing long-term growth while minimizing risk of ruin." },
              { q: "What is reverse line movement?", a: "Reverse line movement occurs when the betting line moves opposite to the direction public money is flowing. If 75% of bets are on Team A but the line moves toward Team B, it indicates sharp (professional) money on Team B." },
              { q: "How do sharp bettors differ from the public?", a: "Sharp bettors use data, models, and disciplined bankroll management. They bet early to move lines, focus on value rather than favorites, and maintain long-term profitability. The public tends to bet favorites, overs, and popular teams based on emotion." },
              { q: "What is line shopping?", a: "Line shopping means comparing odds across multiple sportsbooks to find the best price for your bet. Even half-point differences in spreads or 10-point differences in moneylines compound into significant profit over hundreds of bets." },
              { q: "Can you make a living from sports betting?", a: "Professional sports bettors exist, but it requires significant bankroll, sophisticated modeling, strict discipline, and access to multiple sportsbooks. Most profitable bettors treat it as a business." },
              { q: "What data do professional bettors use?", a: "Professionals use real-time odds feeds, line movement data, public betting percentages, weather data, injury reports, historical performance models, EV calculators, and sharp money indicators." },
            ].map((faq, i) => (
              <details key={i} className="group bg-[#111] border border-white/5 rounded-xl">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium text-sm flex justify-between items-center hover:text-[#FF8900] transition-colors list-none">
                  {faq.q}
                  <span className="text-gray-600 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER CTA
          ================================================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Stop Guessing.
            <br />
            <span className="text-[#FF8900]">Start Winning.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            The difference between recreational bettors and professionals is data.
            Get the same intelligence the sharps use.
          </p>
          <a
            href="#unlock"
            className="inline-block bg-gradient-to-r from-[#FF8900] to-[#DC2626] text-white font-black text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-all uppercase tracking-wider mb-8"
          >
            GET STARTED NOW
          </a>
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-sm mb-3">Questions? Talk to our team.</p>
            <a
              href="tel:2234008146"
              className="inline-block text-white font-black text-2xl hover:text-[#FF8900] transition-colors"
            >
              (223) 400-8146
            </a>
          </div>
        </div>
      </section>
      </>
      )}
    </>
  );
}
