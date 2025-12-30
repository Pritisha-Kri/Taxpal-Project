import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction } from "../slices/transactionsSlice";
import "./Modal.css";

const AddExpenseModal = ({ onClose }) => {
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
      await dispatch(addTransaction({ ...form, type: "expense" })).unwrap();
      alert("Expense added successfully!");
      onClose && onClose();
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Error adding expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Record New Expense</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <p className="modal-subtext">
          Add details about your expense to track your spending better.
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="field">
              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
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
                <option>Food</option>
                <option>Rent</option>
                <option>Utilities</option>
                <option>Transport</option>
                <option>Shopping</option>
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
              placeholder="Add any additional details..."
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

export default AddExpenseModal;
