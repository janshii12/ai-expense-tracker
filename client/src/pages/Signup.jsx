import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../ledger.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try a different email.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper, #FAF7F0)" }}>
      <form onSubmit={handleSubmit} className="panel" style={{ width: 340 }}>
        <h2 style={{ fontFamily: "Newsreader, serif", fontSize: 24, marginBottom: 4 }}>Create your account</h2>
        <p style={{ color: "var(--ink-light, #5B6472)", fontSize: 13, marginBottom: 20 }}>Start tracking in under a minute.</p>
        {error && <p style={{ color: "var(--rust, #B4552F)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid var(--line, #DDD6C4)", borderRadius: 4 }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid var(--line, #DDD6C4)", borderRadius: 4 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, border: "1px solid var(--line, #DDD6C4)", borderRadius: 4 }} />
        <button type="submit" className="add-btn" style={{ width: "100%", padding: 12 }}>Sign Up</button>
        <p style={{ fontSize: 13, marginTop: 16, textAlign: "center", color: "var(--ink-light, #5B6472)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--amber, #C98A2C)" }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;