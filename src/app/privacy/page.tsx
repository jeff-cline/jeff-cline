import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Jeff Cline",
  description: "Privacy policy for jeff-cline.com. How we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy | Jeff Cline",
    description: "Privacy policy for jeff-cline.com. How we collect, use, and protect your information.",
    url: "https://jeff-cline.com/privacy",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Jeff Cline",
    description: "Privacy policy for jeff-cline.com.",
  },
};

export default function PrivacyPage() {
  return (
    <><Breadcrumbs items={[{ label: "Privacy Policy" }]} /><section className="pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: February 12, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              Jeff Cline / Health IT Services (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates jeff-cline.com (the &ldquo;Site&rdquo;). This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you visit our Site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3"><strong>Information You Provide:</strong> Name, email address, phone number, company information, and any other information you voluntarily submit through contact forms, quizzes, or account registration.</p>
            <p><strong>Automatically Collected Information:</strong> IP address, browser type, operating system, referring URLs, pages visited, time spent on pages, and other standard analytics data collected via cookies and similar technologies.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our services</li>
              <li>To respond to your inquiries and communications</li>
              <li>To send you relevant updates, newsletters, and marketing materials (with your consent)</li>
              <li>To analyze Site usage and improve user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share information with trusted third-party service providers who assist in operating our Site and business, subject to confidentiality agreements. We may disclose information when required by law or to protect our rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Cookies & Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience, analyze traffic, and for marketing purposes. You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Security</h2>
            <p>
              We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Our Site is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">9. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information by contacting us. We will respond to your request within a reasonable timeframe.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of the State of Texas, United States, without regard to conflict of law principles.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at:<br />
              Jeff Cline / Health IT Services<br />
              Email: info@jeff-cline.com<br />
              Website: jeff-cline.com
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
