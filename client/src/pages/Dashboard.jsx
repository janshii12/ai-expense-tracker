import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
  const userId = localStorage.getItem("user_id");
  const totalRes = await axios.get(`http://127.0.0.1:8000/stats/monthly-total?user_id=${userId}`);
  setTotal(totalRes.data.total);
  const txnRes = await axios.get(`http://127.0.0.1:8000/transactions/?user_id=${userId}`);
  setTransactions(txnRes.data);
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
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
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
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Add Expense
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
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