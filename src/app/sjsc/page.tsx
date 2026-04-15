"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Profile {
  _id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  website?: string;
  expertise?: string;
  lookingFor?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  photo?: string;
  rating?: number;
  notes?: Note[];
  notesCount?: number;
}

interface Note {
  author: string;
  text: string;
  rating: number;
  createdAt: string;
}

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

const StarSelector = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(rating => (
        <button
          key={rating}
          type="button"
          className={`text-2xl transition-colors ${
            (hover || value) >= rating ? "text-[#D4A843] hover:text-[#F4C553]" : "text-gray-600 hover:text-gray-400"
          }`}
          onClick={() => onChange(rating)}
          onMouseEnter={() => setHover(rating)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
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

export default function SJSCDirectory() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "rating">("name");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ author: "", text: "", rating: 1 });
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [sortBy, filterRating, searchQuery]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) params.set("sort", sortBy);
      if (filterRating !== "all") params.set("filter", filterRating);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const response = await fetch(`/api/sjsc?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileDetails = async (profileId: string) => {
    try {
      const response = await fetch(`/api/sjsc/${profileId}`);
      if (response.ok) {
        const profile = await response.json();
        setSelectedProfile(profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
    }
  };

  const submitNote = async () => {
    if (!selectedProfile || !newNote.author.trim() || !newNote.text.trim()) return;
    
    setSubmittingNote(true);
    try {
      const response = await fetch(`/api/sjsc/${selectedProfile._id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      });

      if (response.ok) {
        // Reset form and refresh profile details
        setNewNote({ author: "", text: "", rating: 1 });
        await fetchProfileDetails(selectedProfile._id);
        await fetchProfiles(); // Refresh main list for updated rating
      }
    } catch (error) {
      console.error("Failed to submit note:", error);
    } finally {
      setSubmittingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1a1a1a] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-[#FF8900] mb-2">SJSC Directory</h1>
              <p className="text-gray-400 text-lg">San Juan Social Club Cruise Directory</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/sjsc/hitt" 
                className="bg-[#39FF14] hover:bg-[#2ECC11] text-black px-6 py-3 rounded-md font-bold transition-colors text-lg shadow-lg"
              >
                🎯 View HITT Work List
              </Link>
              <Link 
                href="/todo" 
                className="bg-[#FF8900] hover:bg-[#e67c00] text-black px-4 py-2 rounded-md font-medium transition-colors"
              >
                ← Back to Vault
              </Link>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sort */}
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as "name" | "rating")}
              className="bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#FF8900]"
            >
              <option value="name">Sort: Alphabetical</option>
              <option value="rating">Sort: Rating High-Low</option>
            </select>

            {/* Rating Filter */}
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-400">Filter:</span>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterRating === "all" ? "bg-[#FF8900] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                }`}
                onClick={() => setFilterRating("all")}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                    filterRating === rating.toString() ? "bg-[#FF8900] text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                  onClick={() => setFilterRating(rating.toString())}
                >
                  <StarRating rating={rating} size="sm" />
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#2a2a2a] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] min-w-[200px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#FF8900] text-xl">Loading profiles...</div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-gray-400">
              {profiles.length} profile{profiles.length !== 1 ? "s" : ""} found
            </div>

            {/* Profile Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {profiles.map(profile => (
                <div 
                  key={profile._id}
                  className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-[#FF8900] transition-colors"
                  onClick={() => fetchProfileDetails(profile._id)}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <ProfileAvatar name={profile.name} photo={profile.photo} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-[#FF8900] mb-1">{profile.name}</h3>
                      <p className="text-gray-300 font-medium text-sm">{profile.title}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-4 line-clamp-3 text-sm">
                    {profile.bio?.substring(0, 150)}...
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {profile.email && (
                      <div className="text-sm">
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-[#FF8900]">{profile.email}</span>
                      </div>
                    )}
                    {profile.website && (
                      <div className="text-sm">
                        <span className="text-gray-500">Website:</span>
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-[#FF8900] hover:underline">
                          Link ↗
                        </a>
                      </div>
                    )}
                    {profile.expertise && (
                      <div className="text-sm">
                        <span className="text-gray-500">Expertise:</span>
                        <span className="ml-2 text-gray-300">{profile.expertise}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <StarRating rating={profile.rating} />
                    <div className="text-sm text-gray-500">
                      {profile.notesCount || 0} note{(profile.notesCount || 0) !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-700 p-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <ProfileAvatar name={selectedProfile.name} photo={selectedProfile.photo} size="lg" />
                <div>
                  <h2 className="text-3xl font-bold text-[#FF8900] mb-2">{selectedProfile.name}</h2>
                  <p className="text-gray-300 text-lg font-medium">{selectedProfile.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Full Profile Info */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-[#FF8900] font-bold mb-3">Profile Information</h3>
                  <div className="space-y-3">
                    {selectedProfile.bio && (
                      <div>
                        <span className="text-gray-400 text-sm block">Bio:</span>
                        <p className="text-gray-200">{selectedProfile.bio}</p>
                      </div>
                    )}
                    {selectedProfile.lookingFor && (
                      <div>
                        <span className="text-gray-400 text-sm block">Looking For:</span>
                        <p className="text-gray-200">{selectedProfile.lookingFor}</p>
                      </div>
                    )}
                    {selectedProfile.expertise && (
                      <div>
                        <span className="text-gray-400 text-sm block">Expertise:</span>
                        <p className="text-gray-200">{selectedProfile.expertise}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-[#FF8900] font-bold mb-3">Contact & Social</h3>
                  <div className="space-y-2">
                    {selectedProfile.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-16">Email:</span>
                        <a href={`mailto:${selectedProfile.email}`} className="text-[#FF8900] hover:underline">
                          {selectedProfile.email}
                        </a>
                      </div>
                    )}
                    {selectedProfile.website && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-16">Website:</span>
                        <a href={selectedProfile.website} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                          Visit Website ↗
                        </a>
                      </div>
                    )}
                    {selectedProfile.linkedin && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-16">LinkedIn:</span>
                        <a href={selectedProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                          View Profile ↗
                        </a>
                      </div>
                    )}
                    {selectedProfile.instagram && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-16">Instagram:</span>
                        <a href={selectedProfile.instagram} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                          View Profile ↗
                        </a>
                      </div>
                    )}
                    {selectedProfile.facebook && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-16">Facebook:</span>
                        <a href={selectedProfile.facebook} target="_blank" rel="noopener noreferrer" className="text-[#FF8900] hover:underline">
                          View Profile ↗
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-[#2a2a2a] rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Overall Rating:</span>
                      <StarRating rating={selectedProfile.rating} size="lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-[#FF8900] font-bold mb-4">
                  Notes ({selectedProfile.notes?.length || 0})
                </h3>

                {/* Existing Notes */}
                {selectedProfile.notes && selectedProfile.notes.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {selectedProfile.notes.map((note, index) => (
                      <div key={index} className="bg-[#2a2a2a] rounded-md p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#FF8900]">{note.author}</span>
                            <StarRating rating={note.rating} size="sm" />
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-200">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6">No notes yet. Be the first to add one!</p>
                )}

                {/* Add Note Form */}
                <div className="bg-[#2a2a2a] rounded-md p-4">
                  <h4 className="text-lg font-medium mb-4">Add a Note</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={newNote.author}
                      onChange={(e) => setNewNote({ ...newNote, author: e.target.value })}
                      className="bg-[#3a3a3a] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900]"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Rating:</span>
                      <StarSelector 
                        value={newNote.rating} 
                        onChange={(rating) => setNewNote({ ...newNote, rating })} 
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Add your note..."
                    value={newNote.text}
                    onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}
                    rows={3}
                    className="w-full bg-[#3a3a3a] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8900] mb-4"
                    required
                  />
                  <button
                    onClick={submitNote}
                    disabled={submittingNote || !newNote.author.trim() || !newNote.text.trim()}
                    className="bg-[#FF8900] hover:bg-[#e67c00] disabled:bg-gray-600 text-black px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    {submittingNote ? "Submitting..." : "Add Note"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}