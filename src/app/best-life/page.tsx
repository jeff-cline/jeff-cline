"use client";

/* eslint-disable @next/next/no-img-element */

const techProducts = [
  {
    name: "MoneyWords",
    description: "AI-powered keyword intelligence and lead generation platform. Find high-intent buyers with precision targeting.",
    domain: "moneywords.org"
  },
  {
    name: "RetargetIQ / el.ag",
    description: "Visitor identification and demand engine. Know who's visiting your site and retarget them with precision.",
    domain: "el.ag"
  },
  {
    name: "PolicyStore",
    description: "AI multi-insurance comparison marketplace. 33+ insurance types with smart matching.",
    domain: "policystore.com"
  },
  {
    name: "Soft Circle",
    description: "Investor discovery and soft circling platform. Connect with the right investors.",
    domain: "softcircle.ai"
  },
  {
    name: "Agents.biz",
    description: "C-suite AI agent tools. Token-based AI agents for business automation.",
    domain: "agents.biz"
  },
  {
    name: "MultiFamilyOffice.ai",
    description: "Deal analysis with Geek Score, BS Meter, and JV flagging for multifamily real estate.",
    domain: "multifamilyoffice.ai"
  }
];

export default function BestLifePage() {
  return (
    <div style={{ 
      background: "#0a0a0a", 
      color: "#fff", 
      minHeight: "100vh", 
      fontFamily: "'Inter', system-ui, sans-serif",
      position: "relative" 
    }}>
      
      {/* Hero Section - Gypsy Tours */}
      <section style={{ 
        padding: "80px 20px 100px",
        background: `linear-gradient(135deg, rgba(42,123,136,0.08) 0%, rgba(42,123,136,0.02) 100%)`,
        borderBottom: "1px solid rgba(42,123,136,0.1)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center"
        }}>
          {/* Left side - Logo */}
          <div style={{ textAlign: "center" }}>
            <img
              src="/gypsy-tours-logo.png"
              alt="Gypsy Tours Logo"
              style={{ 
                width: "100%", 
                height: "auto", 
                maxWidth: "400px",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(42,123,136,0.3)"
              }}
            />
          </div>
          
          {/* Right side - Text */}
          <div>
            <h1 style={{ 
              fontSize: "clamp(36px, 5vw, 56px)", 
              fontWeight: 900, 
              marginBottom: "32px",
              background: "linear-gradient(135deg, #2A7B88 0%, #4FC3D0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1
            }}>
              Join Me on the Gypsy Tours
            </h1>
            
            <p style={{ 
              fontSize: "18px", 
              lineHeight: 1.6, 
              color: "rgba(255,255,255,0.85)",
              marginBottom: "24px"
            }}>
              This is what I'm doing every day. If you follow the schedule and want to just live life together, 
              have fun experiences, and get to know one another... Join me on the Gypsy Tours.
            </p>
            
            <p style={{ 
              fontSize: "16px", 
              lineHeight: 1.6, 
              color: "rgba(255,255,255,0.7)",
              marginBottom: "40px",
              fontStyle: "italic"
            }}>
              "The Most Organized Unorganized Tours Group of Vagabonds. Brought to you by those living their 
              best life on the best networking cruise for business and entrepreneurs."
            </p>
            
            <a 
              href="https://krystalore.com/gypsy-tours"
              style={{ 
                display: "inline-block",
                padding: "16px 32px",
                background: "linear-gradient(135deg, #2A7B88 0%, #4FC3D0 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                textDecoration: "none",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow: "0 10px 30px rgba(42,123,136,0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(42,123,136,0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(42,123,136,0.4)";
              }}
            >
              Get More Information
            </a>
          </div>
        </div>
        
        {/* Mobile responsive adjustments */}
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns"] {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
        `}</style>
      </section>

      {/* Tech Deck Section */}
      <section style={{ 
        padding: "100px 20px",
        background: `linear-gradient(135deg, rgba(255,137,0,0.06) 0%, rgba(255,137,0,0.02) 100%)`,
        borderBottom: "1px solid rgba(255,137,0,0.1)"
      }}>
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto",
          textAlign: "center"
        }}>
          <h2 style={{ 
            fontSize: "clamp(32px, 4vw, 44px)", 
            fontWeight: 900, 
            marginBottom: "24px",
            background: "linear-gradient(135deg, #FF8900 0%, #FFA500 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Want to See the Technology Behind What We Build?
          </h2>
          
          <p style={{ 
            fontSize: "18px", 
            lineHeight: 1.6, 
            color: "rgba(255,255,255,0.7)",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            From AI-powered lead generation to visitor identification, see the full stack of tools and technology we're deploying.
          </p>
          
          <a 
            href="/deck"
            style={{ 
              display: "inline-block",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #FF8900 0%, #FFA500 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#000",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 10px 30px rgba(255,137,0,0.4)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(255,137,0,0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,137,0,0.4)";
            }}
          >
            View the Tech Deck
          </a>
        </div>
      </section>

      {/* Tech Products Showcase */}
      <section style={{ 
        padding: "100px 20px",
        background: "rgba(255,255,255,0.02)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto"
        }}>
          <h2 style={{ 
            fontSize: "clamp(32px, 4vw, 44px)", 
            fontWeight: 900, 
            marginBottom: "60px",
            textAlign: "center",
            background: "linear-gradient(135deg, #FF8900 0%, #2A7B88 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Our Technology Stack
          </h2>
          
          <div style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {techProducts.map((product, index) => (
              <div 
                key={product.domain}
                style={{ 
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "32px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = index % 2 === 0 ? "rgba(255,137,0,0.3)" : "rgba(42,123,136,0.3)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3 style={{ 
                  fontSize: "20px", 
                  fontWeight: "700", 
                  marginBottom: "16px",
                  color: index % 2 === 0 ? "#FF8900" : "#2A7B88"
                }}>
                  {product.name}
                </h3>
                
                <p style={{ 
                  fontSize: "16px", 
                  lineHeight: 1.6, 
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "24px"
                }}>
                  {product.description}
                </p>
                
                <a 
                  href={`https://${product.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: index % 2 === 0 ? "#FF8900" : "#2A7B88",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderBottom: `1px solid ${index % 2 === 0 ? "#FF8900" : "#2A7B88"}`,
                    paddingBottom: "2px",
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Learn More
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule a Meeting Section */}
      <section style={{ 
        padding: "100px 20px",
        background: `linear-gradient(135deg, rgba(42,123,136,0.04) 0%, rgba(255,137,0,0.04) 100%)`
      }}>
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto",
          textAlign: "center"
        }}>
          <h2 style={{ 
            fontSize: "clamp(32px, 4vw, 44px)", 
            fontWeight: 900, 
            marginBottom: "24px"
          }}>
            Let's Talk About Working Together as a Collective
          </h2>
          
          <p style={{ 
            fontSize: "18px", 
            lineHeight: 1.6, 
            color: "rgba(255,255,255,0.7)",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px"
          }}>
            Understanding how MoneyWords and our technology stack can work for your business. Pick a time that works for you.
          </p>
          
          <a 
            href="https://calendly.com/jeff-cline-consulting"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: "inline-block",
              padding: "20px 40px",
              background: "linear-gradient(135deg, #2A7B88 0%, #FF8900 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              textDecoration: "none",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
            }}
          >
            Pick a Time to Meet
          </a>
          
          <p style={{ 
            fontSize: "14px", 
            color: "rgba(255,255,255,0.5)",
            marginTop: "24px",
            fontStyle: "italic"
          }}>
            From the group that joins, I'll be picking people LIVE for the demo.
          </p>
        </div>
      </section>

      {/* Live Demo Callout */}
      <section style={{ 
        padding: "60px 20px",
        background: "rgba(220,38,38,0.08)",
        borderTop: "1px solid rgba(220,38,38,0.2)",
        borderBottom: "1px solid rgba(220,38,38,0.2)"
      }}>
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto",
          textAlign: "center"
        }}>
          <div style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "8px",
            background: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(220,38,38,0.3)",
            marginBottom: "16px"
          }}>
            <span style={{ 
              color: "#DC2626", 
              fontSize: "12px", 
              fontWeight: "700", 
              letterSpacing: "2px", 
              textTransform: "uppercase"
            }}>
              LIVE DEMONSTRATION
            </span>
          </div>
          
          <h3 style={{ 
            fontSize: "clamp(24px, 3vw, 32px)", 
            fontWeight: "800", 
            color: "#fff",
            lineHeight: 1.2
          }}>
            Everyone who comes will have a chance to be picked LIVE for a demo. 
            <span style={{ color: "#DC2626" }}> Real data. Real results. No fluff.</span>
          </h3>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: "60px 20px 40px", 
        textAlign: "center", 
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ marginBottom: "24px" }}>
          <a href="/deck" style={{ 
            color: "rgba(255,255,255,0.4)", 
            textDecoration: "none", 
            margin: "0 16px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Tech Deck
          </a>
          <a href="/sjsc" style={{ 
            color: "rgba(255,255,255,0.4)", 
            textDecoration: "none", 
            margin: "0 16px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            SJSC
          </a>
          <a href="/" style={{ 
            color: "rgba(255,255,255,0.4)", 
            textDecoration: "none", 
            margin: "0 16px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            jeff-cline.com
          </a>
        </div>
        
        <p style={{ 
          fontSize: "12px", 
          color: "rgba(255,255,255,0.25)", 
          marginBottom: "8px"
        }}>
          &copy; {new Date().getFullYear()} Jeff Cline. PROFIT AT SCALE.
        </p>
        
        {/* JC Easter Egg */}
        <a 
          href="https://jeff-cline.com" 
          style={{ 
            fontSize: "6px", 
            opacity: 0.08, 
            color: "#999", 
            textDecoration: "none" 
          }}
        >
          JC
        </a>
      </footer>
    </div>
  );
}