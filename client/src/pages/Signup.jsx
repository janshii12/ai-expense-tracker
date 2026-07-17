import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
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
      await axios.post(`${"https://fintrack-backend-bcg1.onrender.com/"}/auth/signup`, { name, email, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try a different email.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F0" }}>
      <form onSubmit={handleSubmit} className="panel" style={{ width: 340 }}>
        <h2 style={{ fontFamily: "Newsreader, serif", fontSize: 24, marginBottom: 4 }}>Create your account</h2>
        <p style={{ color: "#5B6472", fontSize: 13, marginBottom: 20 }}>Start tracking in under a minute.</p>
        {error && <p style={{ color: "#B4552F", fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #DDD6C4", borderRadius: 4 }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #DDD6C4", borderRadius: 4 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 16, border: "1px solid #DDD6C4", borderRadius: 4 }} />
        <button type="submit" className="add-btn" style={{ width: "100%", padding: 12 }}>Sign Up</button>
        <p style={{ fontSize: 13, marginTop: 16, textAlign: "center", color: "#5B6472" }}>
          Already have an account? <Link to="/login" style={{ color: "#C98A2C" }}>Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;