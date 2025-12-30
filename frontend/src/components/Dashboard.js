import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, Pie } from "react-chartjs-2";
import { FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddIncomeModal from "./AddIncomeModal";
import AddExpenseModal from "./AddExpenseModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  fetchTransactions,
  deleteTransaction,
} from "../slices/transactionsSlice";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: transactions, totals, loading } = useSelector(
    (s) => s.transactions
  );
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await dispatch(deleteTransaction(id));
      dispatch(fetchTransactions());
    }
  };

  // Pie Chart
  const pieData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const byCat = {};
    expenses.forEach(
      (t) => (byCat[t.category] = (byCat[t.category] || 0) + t.amount)
    );
    return {
      labels: Object.keys(byCat),
      datasets: [
        {
          data: Object.values(byCat),
          backgroundColor: ["#402e7a", "#6d4fd1", "#8f84b4", "#b19cd9", "#cbb8e5"],
        },
      ],
    };
  }, [transactions]);

  // Bar Chart
  const barData = useMemo(
    () => ({
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      datasets: [
        {
          label: "Income",
          data: [900, 1200, 1500, 800, 950, totals.income],
          backgroundColor: "#402e7a",
        },
        {
          label: "Expenses",
          data: [600, 400, 500, 700, 450, totals.expense],
          backgroundColor: "#8f84b4",
        },
      ],
    }),
    [totals]
  );

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2 className="page-title">Financial Dashboard</h2>
            <p className="welcome-text">
              Welcome back, <strong>{user?.username || "User"}</strong>!
            </p>
          </div>

          <div className="record-buttons-right">
            <button className="record-btn income-btn" onClick={() => setShowIncomeModal(true)}>
              + Record Income
            </button>
            <button className="record-btn expense-btn" onClick={() => setShowExpenseModal(true)}>
              + Record Expense
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card"><h4>Income</h4><p>${totals.income.toFixed(2)}</p></div>
          <div className="stat-card"><h4>Expenses</h4><p>${totals.expense.toFixed(2)}</p></div>
          <div className="stat-card"><h4>Balance</h4><p>${totals.balance.toFixed(2)}</p></div>
          <div className="stat-card">
            <h4>Savings Rate</h4>
            <p>{totals.income ? Math.round((totals.balance / totals.income) * 100) : 0}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Income vs Expenses</h4>
            <Bar data={barData} />
          </div>
          <div className="chart-card">
            <h4>Expense Breakdown</h4>
            {pieData.labels.length ? <Pie data={pieData} /> : <p>No expense data</p>}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="section-header">
          <h4>Recent Transactions</h4>
          {transactions.length > 5 && (
            <button className="view-all-btn" onClick={() => navigate("/transactions")}>
              View All →
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th>Type</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(showAll ? transactions : transactions.slice(0, 5)).map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "income" ? "text-green" : "text-red"}>
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </td>
                  <td>{t.type}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 👇 Correct placement of Modals inside main */}
        {showIncomeModal && <AddIncomeModal onClose={() => setShowIncomeModal(false)} />}
        {showExpenseModal && <AddExpenseModal onClose={() => setShowExpenseModal(false)} />}
      </main>
    </div>
  );
};

export default Dashboard;




