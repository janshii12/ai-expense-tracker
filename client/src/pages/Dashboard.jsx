import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [anomalies, setAnomalies] = useState([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
  try{
    setLoading(true);
    const userId = localStorage.getItem("user_id");
    const totalRes = await axios.get(`http://127.0.0.1:8000/stats/monthly-total?user_id=${userId}`);
    setTotal(totalRes.data.total);
    const txnRes = await axios.get(`http://127.0.0.1:8000/transactions/?user_id=${userId}`);
    setTransactions(txnRes.data);
    const catRes = await axios.get("http://127.0.0.1:8000/transactions/categories");
    setCategories(catRes.data);
    const anomalyRes = await axios.get(`http://127.0.0.1:8000/stats/anomalies?user_id=${userId}`);
    setAnomalies(anomalyRes.data);
    const insightRes = await axios.get(`http://127.0.0.1:8000/insights/summary?user_id=${userId}`);
    setInsight(insightRes.data.summary);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);
     
  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("http://127.0.0.1:8000/transactions/", {
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      user_id: localStorage.getItem("user_id"),
    });
    setAmount("");
    setDescription("");
    setLoading(true);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/login");
  }
  {loading && <p>Loading your data...</p>}
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button onClick={handleLogout} className="text-sm text-red-600 underline">
        Logout
      </button>
      <p className="text-xl mb-6">Total Spent: ₹{total}</p>

      <form onSubmit={handleAdd} className="bg-white p-4 rounded shadow mb-6 w-80">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border p-2 mb-2 rounded">
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {anomalies.length > 0 && (
          <div className="bg-red-100 p-4 rounded mt-4 w-96">
            <h2 className="text-xl font-bold mb-2 text-red-700">Unusual Spending</h2>
            {anomalies.map((a, i) => (
              <p key={i}>{a.category}: ₹{a.total}</p>
          ))}
          </div>
        )}
        {insight && (
          <div className="bg-blue-100 p-4 rounded mb-4 w-96">
            <h2 className="text-xl font-bold mb-2">AI Insight</h2>
            <p>{insight}</p>
          </div>
      )}
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Add Expense
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
        {transactions.length === 0 && !loading && (
          <p className="text-gray-500">No expenses yet. Add your first one above!</p>
        )}
        {transactions.map((t) => (
          <div key={t.id} className="flex justify-between border-b py-1">
            <span>{t.description}</span>
            <span>₹{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;