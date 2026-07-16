import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../ledger.css";

const barColors = ["var(--rust)", "var(--ink)", "var(--sage)", "var(--amber)"];

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const totalRes = await axios.get(`http://127.0.0.1:8000/stats/monthly-total?user_id=${userId}`);
      setTotal(totalRes.data.total);
      const txnRes = await axios.get(`http://127.0.0.1:8000/transactions/?user_id=${userId}`);
      setTransactions(txnRes.data);
      const catRes = await axios.get("http://127.0.0.1:8000/transactions/categories");
      setCategories(catRes.data);
      const insightRes = await axios.get(`http://127.0.0.1:8000/insights/summary?user_id=${userId}`);
      setInsight(insightRes.data.summary);
      const dailyRes = await axios.get(`http://127.0.0.1:8000/stats/daily?user_id=${userId}`);
      setDaily(dailyRes.data);
      const monthlyRes = await axios.get(`http://127.0.0.1:8000/stats/monthly?user_id=${userId}`);
      setMonthly(monthlyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/transactions/", {
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      user_id: userId,
      category_id: categoryId,
    });
    setAmount(""); setDescription(""); setCategoryId("");
    fetchData();
  };

  const handleDelete = async (id) => {
  await axios.delete(`http://127.0.0.1:8000/transactions/${id}`);
  fetchData();
  };

  const handleEdit = async (t) => {
  const newAmount = prompt("New amount:", t.amount);
  if (newAmount === null) return;
  await axios.put(`http://127.0.0.1:8000/transactions/${t.id}`, {
    amount: parseFloat(newAmount),
  });
  fetchData();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || "Uncategorized";

  const categoryTotals = categories.map((c) => {
    const catTxns = transactions.filter((t) => t.category_id === c.id);
    const catTotal = catTxns.reduce((sum, t) => sum + t.amount, 0);
    return { name: c.name, total: catTotal };
  }).filter((c) => c.total > 0);

  const maxCatTotal = Math.max(...categoryTotals.map((c) => c.total), 1);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="brand">Ledger</div>
        <div className="nav-tab active"><span className="num">01</span> Dashboard</div>
        <div className="nav-tab" onClick={handleLogout}><span className="num">02</span> Logout</div>
        <div className="sidebar-foot">Signed in as<br /><strong style={{ color: "var(--paper)" }}>You</strong></div>
      </div>

      <div className="main">
        <div className="topbar">
          <div>
            <h1>Overview</h1>
            <div className="sub">{loading ? "Loading..." : "Here's where your money went."}</div>
          </div>
        </div>

        <div className="summary">
          <div className="stat">
            <div className="label">Total spent</div>
            <div className="value">₹{total}</div>
          </div>
          <div className="stat">
            <div className="label">Top category</div>
            <div className="value" style={{ fontSize: 20 }}>
              {categoryTotals.length ? categoryTotals.sort((a, b) => b.total - a.total)[0].name : "—"}
            </div>
          </div>
          <div className="stat">
            <div className="label">Transactions</div>
            <div className="value">{transactions.length}</div>
          </div>
          <div className="stat">
            <div className="label">Categories used</div>
            <div className="value">{categoryTotals.length}</div>
          </div>
        </div>

        <div className="grid2">
          <div>
            <div className="panel">
              <h2>Spend by category <span className="tag">all time</span></h2>
              {categoryTotals.map((c, i) => (
                <div className="cat-row" key={c.name}>
                  <div className="cat-name">{c.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(c.total / maxCatTotal) * 100}%`, background: barColors[i % barColors.length] }}></div>
                  </div>
                  <div className="cat-amt">₹{c.total}</div>
                </div>
              ))}
              {categoryTotals.length === 0 && <p style={{ color: "var(--ink-light)", fontSize: 13 }}>Add an expense to see the breakdown.</p>}
            </div>

            <div className="panel">
              <h2>Add expense</h2>
              <form className="add-form" onSubmit={handleAdd}>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                  <option value="">Category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="submit">+ Add</button>
              </form>
            </div>

            <div className="panel">
              <h2>Recent transactions <span className="tag">{transactions.length} total</span></h2>
              <table>
                <thead><tr><th>Description</th><th>Category</th><th style={{ textAlign: "right" }}>Amount</th></tr></thead>
                <tbody>
                  {transactions.slice().reverse().map((t) => (
                    <tr key={t.id}>
                      <td>{t.description}</td>
                      <td><span className="pill">{categoryName(t.category_id)}</span></td>
                      <td className="amt">
                        ₹{t.amount}
                        <button onClick={() => handleEdit(t)} style={{ marginLeft: 10, fontSize: 11, color: "var(--ink-light)", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 6, fontSize: 11, color: "var(--rust)", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && <p style={{ color: "var(--ink-light)", fontSize: 13, marginTop: 12 }}>No transactions yet.</p>}
            </div>
          </div>
          <div className="panel">
            <h2>Monthly report</h2>
            <table>
              <thead><tr><th>Month</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month}><td>{m.month}</td><td className="amt">₹{m.total}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel">
            <h2>Daily report</h2>
            <table>
              <thead><tr><th>Date</th><th style={{textAlign:"right"}}>Total</th></tr></thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.date}><td>{d.date}</td><td className="amt">₹{d.total}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="panel" style={{ background: "transparent", border: "none", padding: 0 }}>
              <h2 style={{ padding: "0 4px" }}>AI Insight <span className="tag">generated</span></h2>
              <div className="receipt">
                <div className="r-head"><b>SPENDING SUMMARY</b>Based on your recent activity</div>
                <p>{insight || "Add some transactions to get your first AI insight."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;