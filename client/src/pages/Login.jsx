import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../ledger.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper, #FAF7F0)" }}>
      <form onSubmit={handleSubmit} className="panel" style={{ width: 340 }}>
        <h2 style={{ fontFamily: "Newsreader, serif", fontSize: 24, marginBottom: 4 }}>Welcome back</h2>
        <p style={{ color: "var(--ink-light, #5B6472)", fontSize: 13, marginBottom: 20 }}>Log in to your Ledger account.</p>
        {error && <p style={{ color: "var(--rust, #B4552F)", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid var(--line, #DDD6C4)", borderRadius: 4 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, border: "1px solid var(--line, #DDD6C4)", borderRadius: 4 }} />
        <button type="submit" className="add-btn" style={{ width: "100%", padding: 12 }}>Log In</button>
        <p style={{ fontSize: 13, marginTop: 16, textAlign: "center", color: "var(--ink-light, #5B6472)" }}>
          No account? <Link to="/signup" style={{ color: "var(--amber, #C98A2C)" }}>Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;