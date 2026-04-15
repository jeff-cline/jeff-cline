export interface PortfolioCompany {
  slug: string;
  name: string;
  description: string;
  brandPromise: string;
  status: "active" | "coming-soon";
  link?: string;
  category: string;
}

export const portfolioCompanies: PortfolioCompany[] = [
  {
    slug: "artlab",
    name: "#ArtLab",
    description:
      "Creative technology platform revolutionizing how artists, brands, and creators collaborate. AI-powered tools that turn creative vision into scalable digital experiences.",
    brandPromise: "Creativity meets technology at scale.",
    status: "active",
    link: "https://artlab.com",
    category: "Creative Technology",
  },
  {
    slug: "health-it-services",
    name: "Health IT Services (HIT)",
    description:
      "Healthcare technology company transforming clinical workflows, patient engagement, and operational efficiency through predictive analytics and intelligent automation.",
    brandPromise: "Smarter healthcare. Better outcomes. Lower cost.",
    status: "active",
    link: "https://healthitservices.com",
    category: "Healthcare Technology",
  },
  {
    slug: "voicecalls-io",
    name: "VoiceCalls.io",
    description:
      "AI-powered voice technology that automates outbound and inbound calling at scale. Natural language conversations that convert, qualify, and close—24/7.",
    brandPromise: "Every call counts. Every call converts.",
    status: "active",
    link: "https://voicecalls.io",
    category: "AI Voice Technology",
  },
  {
    slug: "voicedrips",
    name: "VoiceDrips.com",
    description:
      "Voice marketing automation platform that delivers personalized voice messages at scale. Drip campaigns that sound human, feel personal, and drive action.",
    brandPromise: "Your voice. Their inbox. Automated.",
    status: "coming-soon",
    link: "https://voicedrips.com",
    category: "Voice Marketing",
  },
  {
    slug: "krystalore",
    name: "Krystalore",
    description:
      "Executive wellness platform designed for high-performers who refuse to burn out. Data-driven wellness protocols that optimize energy, focus, and longevity.",
    brandPromise: "Peak performance is a system, not a sacrifice.",
    status: "coming-soon",
    link: "https://krystalore.com",
    category: "Executive Wellness",
  },
];
