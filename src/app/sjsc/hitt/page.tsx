"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface HittLead {
  _id: string;
  rank: number;
  name: string;
  email: string;
  company: string;
  title: string;
  estimatedNetWorth: string;
  tier: string;
  confidence: string;
  keyFacts: string;
  photo?: string;
  bio?: string;
  expertise?: string;
  lookingFor?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  phone?: string;
  notes?: Note[];
  rating?: number;
  deckMessage?: string;
  hasProfileMatch: boolean;
  sjscProfileId?: string;
}

interface Note {
  author: string;
  text: string;
  rating: number;
  createdAt: string;
}

const TIER_COLORS = {
  "TIER 1 ($10M+)": "#39FF14", // Neon green
  "TIER 2 ($1M-$10M)": "#FF8900", // Orange
  "TIER 3 ($250K-$1M)": "#D4A843", // Gold
  "TIER 4 (Unknown)": "#666", // Gray
};

const TIER_BACKGROUNDS = {
  "TIER 1 ($10M+)": "rgba(57, 255, 20, 0.05)",
  "TIER 2 ($1M-$10M)": "rgba(255, 137, 0, 0.05)",
  "TIER 3 ($250K-$1M)": "rgba(212, 168, 67, 0.05)",
  "TIER 4 (Unknown)": "rgba(102, 102, 102, 0.05)",
};

const StarRating = ({ rating, size = "md" }: { rating?: number; size?: "sm" | "md" | "lg" }) => {
  const sizeMap = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-2xl"
  };
  
  if (!rating) {
    return <span className={`${sizeMap[size]} text-gray-600`}>Not rated</span>;
  }

  const fullStars = Math.round(rating);
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span 
        key={i}
        className={i <= fullStars ? "text-[#D4A843]" : "text-gray-600"}
      >
        ★
      </span>
    );
  }
  
  return <span className={`${sizeMap[size]} tracking-wider`}>{stars}</span>;
};

const ProfileAvatar = ({ name, photo, size = "md" }: { name: string; photo?: string; size?: "sm" | "md" | "lg" }) => {
  const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['#FF8900', '#DC2626', '#D4A843', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const sizeMap = { sm: 'w-10 h-10 text-sm', md: 'w-14 h-14 text-lg', lg: 'w-20 h-20 text-2xl' };
  const imgSizeMap = { sm: 40, md: 56, lg: 80 };
  
  if (photo) {
    return (
      <img 
        src={photo}
        alt={name}
        width={imgSizeMap[size]}
        height={imgSizeMap[size]}
        className={`${sizeMap[size]} rounded-full object-cover flex-shrink-0 border-2 border-[#FF8900]/30`}
      />
    );
  }
  
  return (
    <div 
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-black flex-shrink-0`}
      style={{ backgroundColor: colors[colorIndex] }}
    >
      {initials}
    </div>
  );
};

const ConfidenceIndicator = ({ confidence }: { confidence: string }) => {
  const getColor = () => {
    switch (confidence.toLowerCase()) {
      case 'high': return '#39FF14';
      case 'medium': return '#FF8900';
      case 'low': return '#666';
      default: return '#666';
    }
  };

  const getDots = () => {
    switch (confidence.toLowerCase()) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-400 mr-1">{confidence.toUpperCase()}</span>
      {Array.from({ length: getDots() }, (_, i) => (
        <div 
          key={i} 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getColor() }}
        />
      ))}
    </div>
  );
};

const TierBadge = ({ tier }: { tier: string }) => {
  const color = TIER_COLORS[tier as keyof typeof TIER_COLORS] || "#666";
  const tierNumber = tier.split(' ')[1];
  
  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-bold text-black"
      style={{ backgroundColor: color }}
    >
      TIER {tierNumber}
    </span>
  );
};

export default function HittWorkList() {
  const [leads, setLeads] = useState<HittLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [selectedTier]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedTier !== "all") params.set("tier", selectedTier);

      const response = await fetch(`/api/sjsc/hitt?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Failed to fetch HITT leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (leadId: string) => {
    setExpandedLead(expandedLead === leadId ? null : leadId);
  };

  const getNetWorthColor = (tier: string) => {
    return TIER_COLORS[tier as keyof typeof TIER_COLORS] || "#666";
  };

  const filterLeadsByTier = (leads: HittLead[], tier: string) => {
    if (tier === "all") return leads;
    const tierNumber = parseInt(tier);
    return leads.filter(lead => lead.tier.includes(`TIER ${tierNumber}`));
  };

  const filteredLeads = filterLeadsByTier(leads, selectedTier);

  // Group leads by tier for visual separation
  const groupedLeads = filteredLeads.reduce((groups, lead) => {
    const tierKey = lead.tier;
    if (!groups[tierKey]) groups[tierKey] = [];
    groups[tierKey].push(lead);
    return groups;
  }, {} as Record<string, HittLead[]>);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1a1a1a] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#FF8900] mb-2">HITT Work List</h1>
              <p className="text-gray-400 text-lg">High Intent Targeted Tier -- Ranked by Estimated Net Worth</p>
            </div>
            <Link 
              href="/sjsc" 
              className="bg-[#FF8900] hover:bg-[#e67c00] text-black px-4 py-2 rounded-md font-medium transition-colors"
            >
              ← Back to SJSC
            </Link>
          </div>
          
          {/* Tier Filter Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-gray-400 text-sm">Filter by tier:</span>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                selectedTier === "all" ? "bg-[#FF8900] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setSelectedTier("all")}
            >
              ALL
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                selectedTier === "1" ? "bg-[#39FF14] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setSelectedTier("1")}
            >
              TIER 1 ($10M+)
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                selectedTier === "2" ? "bg-[#FF8900] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setSelectedTier("2")}
            >
              TIER 2 ($1M-$10M)
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                selectedTier === "3" ? "bg-[#D4A843] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setSelectedTier("3")}
            >
              TIER 3 ($250K-$1M)
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                selectedTier === "4" ? "bg-[#666] text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
              onClick={() => setSelectedTier("4")}
            >
              TIER 4 (Unknown)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#FF8900] text-xl">Loading HITT leads...</div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-gray-400">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} found
              {selectedTier !== "all" && ` in TIER ${selectedTier}`}
            </div>

            {/* Leads List by Tier */}
            {selectedTier === "all" ? (
              // Show all tiers grouped
              Object.entries(groupedLeads)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([tierName, tierLeads]) => (
                  <div key={tierName} className="mb-8">
                    <div 
                      className="sticky top-0 z-10 py-3 mb-4 border-l-4"
                      style={{ 
                        backgroundColor: TIER_BACKGROUNDS[tierName as keyof typeof TIER_BACKGROUNDS],
                        borderLeftColor: TIER_COLORS[tierName as keyof typeof TIER_COLORS]
                      }}
                    >
                      <div className="pl-4">
                        <h2 className="text-2xl font-bold" style={{ color: TIER_COLORS[tierName as keyof typeof TIER_COLORS] }}>
                          {tierName}
                        </h2>
                        <p className="text-gray-400 text-sm">{tierLeads.length} lead{tierLeads.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {tierLeads.map(lead => (
                        <LeadRow 
                          key={lead._id} 
                          lead={lead} 
                          expanded={expandedLead === lead._id}
                          onToggle={() => toggleExpanded(lead._id)}
                          getNetWorthColor={getNetWorthColor}
                        />
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              // Show single tier
              <div className="space-y-3">
                {filteredLeads.map(lead => (
                  <LeadRow 
                    key={lead._id} 
                    lead={lead} 
                    expanded={expandedLead === lead._id}
                    onToggle={() => toggleExpanded(lead._id)}
                    getNetWorthColor={getNetWorthColor}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const LeadRow = ({ 
  lead, 
  expanded, 
  onToggle, 
  getNetWorthColor 
}: { 
  lead: HittLead; 
  expanded: boolean; 
  onToggle: () => void;
  getNetWorthColor: (tier: string) => string;
}) => {
  return (
    <div 
      className="bg-[#1e1e1e] border border-gray-700 rounded-lg overflow-hidden hover:border-[#FF8900] transition-colors cursor-pointer"
      style={{ 
        borderLeft: `4px solid ${getNetWorthColor(lead.tier)}`,
        backgroundColor: expanded ? TIER_BACKGROUNDS[lead.tier as keyof typeof TIER_BACKGROUNDS] : undefined
      }}
      onClick={onToggle}
    >
      {/* Main Row */}
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Rank */}
          <div className="text-4xl font-bold text-[#FF8900] min-w-[80px]">
            #{lead.rank}
          </div>
          
          {/* Avatar */}
          <ProfileAvatar name={lead.name} photo={lead.photo} size="md" />
          
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-[#FF8900] hover:underline">
                {lead.name}
              </h3>
              <TierBadge tier={lead.tier} />
              <ConfidenceIndicator confidence={lead.confidence} />
            </div>
            
            <p className="text-gray-300 font-medium mb-1">
              {lead.company} • {lead.title}
            </p>
            
            <p 
              className="text-lg font-bold mb-2"
              style={{ color: getNetWorthColor(lead.tier) }}
            >
              {lead.estimatedNetWorth}
            </p>
            
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
              {lead.keyFacts}
            </p>
            
            <p className="text-[#FF8900] text-sm">{lead.email}</p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-600 bg-[#2a2a2a] p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h4 className="text-[#FF8900] font-bold mb-4">Profile Details</h4>
              
              {lead.bio && (
                <div className="mb-4">
                  <span className="text-gray-400 text-sm block mb-1">Bio:</span>
                  <p className="text-gray-200">{lead.bio}</p>
                </div>
              )}
              
              {lead.expertise && (
                <div className="mb-4">
                  <span className="text-gray-400 text-sm block mb-1">Expertise:</span>
                  <p className="text-gray-200">{lead.expertise}</p>
                </div>
              )}
              
              {lead.lookingFor && (
                <div className="mb-4">
                  <span className="text-gray-400 text-sm block mb-1">Looking For:</span>
                  <p className="text-gray-200">{lead.lookingFor}</p>
                </div>
              )}
              
              {lead.deckMessage && (
                <div className="mb-4">
                  <span className="text-gray-400 text-sm block mb-1">Deck Request Message:</span>
                  <p className="text-gray-200 italic">"{lead.deckMessage}"</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div>
              <h4 className="text-[#FF8900] font-bold mb-4">Contact & Social</h4>
              
              <div className="space-y-3">
                {lead.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">Email:</span>
                    <a href={`mailto:${lead.email}`} className="text-[#FF8900] hover:underline">
                      {lead.email}
                    </a>
                  </div>
                )}
                
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">Phone:</span>
                    <a href={`tel:${lead.phone}`} className="text-[#FF8900] hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                )}
                
                {lead.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">Website:</span>
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                      Visit ↗
                    </a>
                  </div>
                )}
                
                {lead.linkedin && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">LinkedIn:</span>
                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                      View Profile ↗
                    </a>
                  </div>
                )}
                
                {lead.instagram && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">Instagram:</span>
                    <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                      View Profile ↗
                    </a>
                  </div>
                )}
                
                {lead.facebook && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm w-20">Facebook:</span>
                    <a href={lead.facebook} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                      View Profile ↗
                    </a>
                  </div>
                )}
              </div>

              {/* SJSC Rating */}
              {lead.rating && (
                <div className="mt-6 p-3 bg-[#3a3a3a] rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">SJSC Rating:</span>
                    <StarRating rating={lead.rating} size="lg" />
                  </div>
                </div>
              )}
              
              {/* Profile Match Status */}
              <div className="mt-4 p-3 bg-[#3a3a3a] rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SJSC Profile:</span>
                  <span className={`text-sm font-medium ${lead.hasProfileMatch ? 'text-[#39FF14]' : 'text-gray-500'}`}>
                    {lead.hasProfileMatch ? '✓ Matched' : '✗ No Match'}
                  </span>
                </div>
                {lead.notes && lead.notes.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    {lead.notes.length} SJSC note{lead.notes.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};