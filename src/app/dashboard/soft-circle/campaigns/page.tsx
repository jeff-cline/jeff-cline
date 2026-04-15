"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import SoftCircleSubNav from "../SubNav";

export default function SoftCircleCampaignsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [phoneCount, setPhoneCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/dashboard/soft-circle/campaigns");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/soft-circle/reports").then(r => r.json()).then(d => setPhoneCount(d.stats?.withPhone || 0)).catch(() => {});
    }
  }, [session]);

  if (status === "loading") return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardNav />
        <SoftCircleSubNav active="campaigns" />
        <h1 className="text-2xl font-bold mb-6">Voicemail Campaigns</h1>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📞</div>
            <h2 className="text-xl font-bold mb-2">VoiceDrips Integration Coming Soon</h2>
            <p className="text-gray-400 text-sm">
              Send ringless voicemail blasts to investors in your database. Connect your VoiceDrips account
              to select campaigns, target phone numbers, and launch outreach at scale.
            </p>
          </div>

          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Investors with phone numbers</span>
              <span className="text-2xl font-bold text-[#FF8900]">{phoneCount}</span>
            </div>
          </div>

          <button disabled className="w-full bg-white/10 text-gray-500 font-bold py-3 rounded-lg cursor-not-allowed">
            Connect VoiceDrips Account
          </button>
          <p className="text-xs text-gray-600 text-center mt-3">Feature under development</p>
        </div>
      </div>
    </div>
  );
}
