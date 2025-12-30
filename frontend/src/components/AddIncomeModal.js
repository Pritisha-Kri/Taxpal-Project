import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../slices/transactionsSlice";
import "./Modal.css";

const AddIncomeModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      await dispatch(addTransaction({ ...form, type: "income" })).unwrap();
      alert("Income added successfully!");
      onClose && onClose();
    } catch (err) {
      console.error("Error adding income:", err);
      alert("Error adding income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Record New Income</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <p className="modal-subtext">
          Add details about your income to track your finances better.
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="field">
              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Freelance Project"
                required
              />
            </div>

            <div className="field">
              <label>Amount</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option>Salary</option>
                <option>Freelance</option>
                <option>Investments</option>
                <option>Business</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="field fullwidth">
            <label>Notes (Optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any details..."
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeModal;
