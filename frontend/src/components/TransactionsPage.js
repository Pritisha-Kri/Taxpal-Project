import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, deleteTransaction } from "../slices/transactionsSlice";
import { FaTrash } from "react-icons/fa";
import AddIncomeModal from "./AddIncomeModal";
import AddExpenseModal from "./AddExpenseModal";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { items: transactions, loading } = useSelector((s) => s.transactions);

  // 👉 Modal states
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await dispatch(deleteTransaction(id));
      dispatch(fetchTransactions()); // 🔄 Refresh after delete
    }
  };

  if (loading) return <div className="loading">Fetching Transactions...</div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">

        {/* 🔥 PAGE HEADER + Buttons */}
        <div className="transactions-header">
          <h2 className="page-title">All Transactions</h2>

          <div className="record-buttons-right">
            <button
              className="record-btn income-btn"
              onClick={() => setShowIncomeModal(true)}
            >
              + Record Income
            </button>

            <button
              className="record-btn expense-btn"
              onClick={() => setShowExpenseModal(true)}
            >
              + Record Expense
            </button>
          </div>
        </div>

        {/* 🌐 Transactions Table */}
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.description}</td>
                  <td>{t.category}</td>
                  <td className={t.type === "income" ? "text-green" : "text-red"}>
                    {t.type === "income" ? "+" : "-"}₹{t.amount}
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

        {/* 🛑 MODALS HERE (same as Dashboard) */}
        {showIncomeModal && (
          <AddIncomeModal onClose={() => setShowIncomeModal(false)} />
        )}

        {showExpenseModal && (
          <AddExpenseModal onClose={() => setShowExpenseModal(false)} />
        )}
        
      </main>
    </div>
  );
};

export default TransactionsPage;
