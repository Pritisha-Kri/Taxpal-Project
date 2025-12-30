const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// 🧾 Get all transactions for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// ➕ Add a new transaction (income/expense)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { description, amount, category, date, notes, type } = req.body;

    if (!description || !amount || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const transaction = new Transaction({
      userId: req.user._id,
      description,
      amount,
      category,
      date,
      notes,
      type,
    });

    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ message: "Error adding transaction" });
  }
});

// ✏️ Update a transaction
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Transaction not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating transaction" });
  }
});

// 🗑️ Delete a transaction
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting transaction" });
  }
});

module.exports = router;
