import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Investment Disclosures | Jeff Cline",
  description: "Investment disclosures, regulatory information, and risk disclosures for Jeff Cline affiliated funds and portfolio companies.",
  openGraph: {
    title: "Investment Disclosures | Jeff Cline",
    description: "Investment disclosures, regulatory information, and risk disclosures.",
    url: "https://jeff-cline.com/investment-disclosures",
    siteName: "Jeff Cline",
    type: "website",
    images: [{ url: "/favicon-192x192.png", width: 192, height: 192, alt: "Jeff Cline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment Disclosures | Jeff Cline",
    description: "Investment disclosures, regulatory information, and risk disclosures.",
  },
};

export default function InvestmentDisclosuresPage() {
  return (
    <><Breadcrumbs items={[{ label: "Investment Disclosures" }]} /><section className="pt-8 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4">Investment Disclosures</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: February 15, 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* GENERAL DISCLAIMER */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. General Disclaimer</h2>
            <p className="mb-3">
              The information provided on this website and by Jeff Cline, Health IT Services, and affiliated entities (collectively, &ldquo;the Firm&rdquo;) is for informational and educational purposes only. Nothing on this site constitutes an offer to sell, a solicitation of an offer to buy, or a recommendation for any security, financial product, or investment strategy.
            </p>
            <p>
              Past performance is not indicative of future results. All investments involve risk, including the potential loss of principal. There is no guarantee that any investment strategy or fund will achieve its investment objectives.
            </p>
          </div>

          {/* REGULATORY STATUS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Regulatory Status</h2>
            <p className="mb-3">
              The Firm may operate in an advisory or consulting capacity and may not be registered as an investment adviser with the U.S. Securities and Exchange Commission (SEC) or any state securities regulatory authority. Any investment advisory services are offered only pursuant to applicable exemptions or registrations.
            </p>
            <p>
              This website does not constitute investment advice as defined under the Investment Advisers Act of 1940, as amended, or any comparable state or foreign securities laws.
            </p>
          </div>

          {/* RISK DISCLOSURES */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Risk Disclosures</h2>
            <p className="mb-4">Investing in securities, private equity, venture capital, and alternative investments carries significant risks, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Market Risk:</strong> The value of investments may decline due to market conditions, economic developments, or geopolitical events.</li>
              <li><strong>Liquidity Risk:</strong> Certain investments, particularly private placements and alternative assets, may be illiquid and difficult to sell or value.</li>
              <li><strong>Concentration Risk:</strong> Portfolios concentrated in specific sectors, industries, or geographies may experience heightened volatility.</li>
              <li><strong>Credit Risk:</strong> Issuers of debt securities may default on interest or principal payments.</li>
              <li><strong>Currency Risk:</strong> Investments denominated in foreign currencies are subject to exchange rate fluctuations.</li>
              <li><strong>Regulatory Risk:</strong> Changes in laws, regulations, or government policy may adversely impact investment returns.</li>
              <li><strong>Leverage Risk:</strong> Use of borrowed funds or derivatives can amplify both gains and losses.</li>
              <li><strong>Operational Risk:</strong> Fund operations, technology failures, or human error may result in financial loss.</li>
              <li><strong>Loss of Principal:</strong> Investors may lose some or all of their invested capital.</li>
            </ul>
          </div>

          {/* ACCREDITED / QUALIFIED INVESTORS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Accredited &amp; Qualified Investors</h2>
            <p className="mb-3">
              Certain investment opportunities referenced on this site may be available only to &ldquo;accredited investors&rdquo; as defined under Rule 501 of Regulation D of the Securities Act of 1933, or &ldquo;qualified purchasers&rdquo; as defined under Section 2(a)(51) of the Investment Company Act of 1940.
            </p>
            <p>
              Any offering of securities will be made only by means of a confidential private placement memorandum (PPM), limited partnership agreement, or similar offering document, which should be read in its entirety prior to making any investment decision.
            </p>
          </div>

          {/* FORWARD-LOOKING STATEMENTS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Forward-Looking Statements</h2>
            <p>
              This website may contain forward-looking statements, projections, or estimates based on current expectations and assumptions. These statements are inherently uncertain and actual results may differ materially from those projected. The Firm undertakes no obligation to update any forward-looking statements.
            </p>
          </div>

          {/* AFFILIATED INSTITUTIONS & CUSTODIANS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Affiliated Financial Institutions &amp; Custodians</h2>
            <p className="mb-4">
              The Firm may maintain relationships with or reference the following financial institutions, custodians, and service providers. Listing does not imply endorsement, partnership, or agency unless explicitly stated:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "Limerick Investments",
                "Vira Capital",
                "Goldman Sachs",
                "J.P. Morgan",
                "Morgan Stanley",
                "BlackRock",
                "Fidelity Investments",
                "Charles Schwab",
                "Vanguard",
                "Citadel",
                "Bridgewater Associates",
                "Apollo Global Management",
                "KKR & Co.",
                "The Carlyle Group",
                "Blackstone",
                "Tiger Global Management",
                "Sequoia Capital",
                "Andreessen Horowitz (a16z)",
                "SoftBank Vision Fund",
                "Berkshire Hathaway",
              ].map((name) => (
                <span key={name} className="text-gray-400 text-sm py-1 border-b border-gray-800">{name}</span>
              ))}
            </div>
          </div>

          {/* EXCHANGES & MARKETS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">7. Exchanges &amp; Markets</h2>
            <p className="mb-4">
              Securities discussed or held may be listed on, or subject to the rules and regulations of, the following exchanges and marketplaces:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "New York Stock Exchange (NYSE)",
                "NASDAQ",
                "Chicago Mercantile Exchange (CME)",
                "Chicago Board Options Exchange (CBOE)",
                "Intercontinental Exchange (ICE)",
                "London Stock Exchange (LSE)",
                "Tokyo Stock Exchange (TSE)",
                "Hong Kong Stock Exchange (HKEX)",
                "Euronext",
                "Deutsche Börse (XETRA)",
                "Shanghai Stock Exchange (SSE)",
                "Toronto Stock Exchange (TSX)",
                "Australian Securities Exchange (ASX)",
                "Bombay Stock Exchange (BSE)",
                "National Stock Exchange of India (NSE)",
                "Singapore Exchange (SGX)",
                "SIX Swiss Exchange",
                "Johannesburg Stock Exchange (JSE)",
                "OTC Markets (OTCQX, OTCQB, Pink Sheets)",
                "BATS Global Markets",
              ].map((name) => (
                <span key={name} className="text-gray-400 text-sm py-1 border-b border-gray-800">{name}</span>
              ))}
            </div>
          </div>

          {/* REGULATORY BODIES */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">8. Regulatory Bodies &amp; Industry Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "U.S. Securities and Exchange Commission (SEC)",
                "Financial Industry Regulatory Authority (FINRA)",
                "Commodity Futures Trading Commission (CFTC)",
                "National Futures Association (NFA)",
                "Federal Reserve Board",
                "Office of the Comptroller of the Currency (OCC)",
                "Financial Crimes Enforcement Network (FinCEN)",
                "Securities Investor Protection Corporation (SIPC)",
                "CFA Institute",
                "Alternative Investment Management Association (AIMA)",
              ].map((name) => (
                <span key={name} className="text-gray-400 text-sm py-1 border-b border-gray-800">{name}</span>
              ))}
            </div>
          </div>

          {/* FINANCIAL NEWS & DATA */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">9. Financial News &amp; Data Sources</h2>
            <p className="mb-4">
              Market commentary, research, and data referenced on this site may be sourced from or informed by the following high-end financial news and data providers:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {[
                "Bloomberg",
                "Reuters",
                "The Wall Street Journal",
                "Financial Times",
                "CNBC",
                "Fox Business",
                "Barron's",
                "MarketWatch",
                "Morningstar",
                "S&P Global Market Intelligence",
                "Moody's Analytics",
                "Fitch Ratings",
                "PitchBook",
                "Preqin",
                "The Economist",
                "Institutional Investor",
                "Hedge Fund Research (HFR)",
                "Cambridge Associates",
                "FactSet",
                "Refinitiv (LSEG)",
              ].map((name) => (
                <span key={name} className="text-gray-400 text-sm py-1 border-b border-gray-800">{name}</span>
              ))}
            </div>
          </div>

          {/* CONFLICTS OF INTEREST */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">10. Conflicts of Interest</h2>
            <p className="mb-3">
              The Firm, its principals, affiliates, and employees may hold positions in securities or investments discussed on this website. The Firm may receive compensation, fees, or other economic benefit from portfolio companies, investment opportunities, or third-party referrals.
            </p>
            <p>
              Potential conflicts of interest are managed through internal policies and disclosed to investors in applicable offering documents.
            </p>
          </div>

          {/* FEES & COMPENSATION */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">11. Fees &amp; Compensation</h2>
            <p>
              Investment fund structures may charge management fees, performance fees (carried interest), administrative fees, and other expenses. Fee structures vary by fund and are detailed in each fund&rsquo;s offering documents. Typical structures may include a 1&ndash;2% annual management fee and 15&ndash;20% carried interest above a preferred return hurdle.
            </p>
          </div>

          {/* TAX CONSIDERATIONS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">12. Tax Considerations</h2>
            <p>
              The Firm does not provide tax advice. Investment returns, distributions, and capital events may have tax implications that vary by jurisdiction and individual circumstances. Investors should consult their own tax advisors regarding the tax consequences of any investment.
            </p>
          </div>

          {/* NO GUARANTEE / NO WARRANTY */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">13. No Warranty</h2>
            <p>
              All information on this website is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied. The Firm makes no representations or warranties as to the accuracy, completeness, timeliness, or reliability of any information presented. The Firm disclaims all liability for any errors, omissions, or losses arising from reliance on this information.
            </p>
          </div>

          {/* GOVERNING LAW */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">14. Governing Law &amp; Jurisdiction</h2>
            <p>
              These disclosures and any disputes arising from the use of this website shall be governed by the laws of the State of Texas, without regard to conflict of law principles. Any legal proceedings shall be brought exclusively in the state or federal courts located in Dallas County, Texas.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3">15. Contact &amp; Investor Relations</h2>
            <p>
              For questions regarding these disclosures, investment opportunities, or to request offering documents:<br />
              <br />
              Jeff Cline / Health IT Services<br />
              Email: <Link href="mailto:investors@jeff-cline.com" className="text-[#FF8900] hover:underline">investors@jeff-cline.com</Link><br />
              Website: <Link href="https://jeff-cline.com" className="text-[#FF8900] hover:underline">jeff-cline.com</Link>
            </p>
          </div>

          {/* DEMO NOTICE */}
          <div className="mt-8 p-6 border border-gray-700 rounded-lg bg-gray-900/50">
            <p className="text-gray-500 text-xs italic">
              <strong className="text-gray-400">DEMO NOTICE:</strong> This Investment Disclosures page is provided for demonstration and informational purposes to illustrate the type of disclosures typically found on institutional fund and investment advisory websites. It does not constitute a live offering or active fund registration. All references to financial institutions, exchanges, and data providers are for illustrative purposes only.
            </p>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
