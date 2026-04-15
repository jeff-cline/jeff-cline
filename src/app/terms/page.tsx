import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Jeff Cline",
  description: "Terms of service for jeff-cline.com. Please read these terms carefully before using our site.",
  openGraph: {
    title: "Terms of Service | Jeff Cline",
    description: "Terms of service for jeff-cline.com.",
    url: "https://jeff-cline.com/terms",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Jeff Cline",
    description: "Terms of service for jeff-cline.com.",
  },
};

export default function TermsPage() {
  return (
    <><Breadcrumbs items={[{ label: "Terms of Service" }]} /><section className="pt-8 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: February 12, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using jeff-cline.com (the &ldquo;Site&rdquo;), operated by Jeff Cline / Health IT Services (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Use of the Site</h2>
            <p>
              You may use the Site for lawful purposes only. You agree not to: (a) use the Site in any way that violates applicable law; (b) attempt to gain unauthorized access to any part of the Site; (c) interfere with the proper functioning of the Site; (d) use automated systems to scrape or extract data from the Site without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
            <p>
              All content on this Site—including but not limited to text, graphics, logos, images, software, methodologies, frameworks, data models, and proprietary business processes—is the intellectual property of Jeff Cline / Health IT Services and is protected by United States and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works from, or publicly display any content without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Proprietary Frameworks & Methodologies</h2>
            <p>
              The business frameworks, strategic methodologies, technology assessments, and analytical tools described on this Site are proprietary to Jeff Cline / Health IT Services. Any unauthorized use, reproduction, or distribution of these materials constitutes infringement of our intellectual property rights and may result in legal action.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. User Accounts</h2>
            <p>
              If you create an account on the Site, you are responsible for maintaining the confidentiality of your credentials and for all activity under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Disclaimer of Warranties</h2>
            <p>
              THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, JEFF CLINE / HEALTH IT SERVICES, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="mt-3">
              IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID US, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Jeff Cline / Health IT Services from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising from your use of the Site or violation of these Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">9. Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of any third-party sites.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">10. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of the State of Texas, United States, without regard to conflict of law provisions. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Texas.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">11. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes are effective upon posting to the Site. Continued use of the Site after changes constitutes acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">13. Contact</h2>
            <p>
              Questions about these Terms? Contact us at:<br />
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
