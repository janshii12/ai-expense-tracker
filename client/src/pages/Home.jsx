import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ background: "#FBF3E7", minHeight: "100vh" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: "#3E2B1F" }}>
          FinTrack
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/login" style={{ color: "#3E2B1F", textDecoration: "none", fontWeight: 500 }}>Log In</Link>
          <Link to="/signup" style={{
            background: "#C9873E", color: "#fff", padding: "8px 20px",
            borderRadius: 24, textDecoration: "none", fontWeight: 600
          }}>Get Started</Link>
        </div>
      </nav>

      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "center", gap: 60, padding: "60px 48px", maxWidth: 1100, margin: "0 auto"
      }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 44, color: "#3E2B1F", lineHeight: 1.2, marginBottom: 16 }}>
            Track your money,<br />the smart way 🌿
          </h1>
          <p style={{ color: "#6B5847", fontSize: 17, marginBottom: 28, lineHeight: 1.6 }}>
            FinTrack doesn't just log your spending — it tells you what's
            unusual, what's trending, and gives you AI-powered tips to save more.
          </p>
          <Link to="/signup" style={{
            background: "#3E2B1F", color: "#fff", padding: "14px 32px",
            borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 16
          }}>Start Tracking Free →</Link>
        </div>

        <div style={{
          width: 340, height: 340, borderRadius: "50%",
          background: "#F0E0C8", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 120, boxShadow: "0 20px 60px rgba(62,43,31,0.15)"
        }}>
          💰
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 24, padding: "20px 48px 80px", maxWidth: 1000, margin: "0 auto"
      }}>
        {[
          { icon: "📊", title: "See where it goes", text: "Visual breakdowns by category, updated instantly." },
          { icon: "⚠️", title: "Catch overspending", text: "Get flagged when a category spikes above normal." },
          { icon: "🤖", title: "AI insights", text: "Plain-language summaries and money-saving tips." },
        ].map((f) => (
          <div key={f.title} style={{
            background: "#fff", borderRadius: 16, padding: 28,
            boxShadow: "0 4px 20px rgba(62,43,31,0.06)"
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontFamily: "Georgia, serif", color: "#3E2B1F", marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: "#6B5847", fontSize: 14, lineHeight: 1.6 }}>{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;