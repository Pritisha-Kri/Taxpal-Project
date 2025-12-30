const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const Budget = require('../models/Budget');

const router = express.Router();

/**
 * @route   GET /api/budgets
 * @desc    Fetch all budgets for logged-in user
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(budgets);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ message: 'Server error while fetching budgets' });
  }
});

/**
 * @route   POST /api/budgets
 * @desc    Add a new budget
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  [
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('month').notEmpty().withMessage('Month is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { category, amount, month, description } = req.body;
      const newBudget = new Budget({
        userId: req.user._id,
        category,
        amount,
        month,
        description
      });
      await newBudget.save();
      res.status(201).json(newBudget);
    } catch (err) {
      console.error('Error adding budget:', err);
      res.status(500).json({ message: 'Server error adding budget' });
    }
  }
);

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update existing budget
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const { category, amount, month, description } = req.body;
    budget.category = category ?? budget.category;
    budget.amount = amount ?? budget.amount;
    budget.month = month ?? budget.month;
    budget.description = description ?? budget.description;

    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ message: 'Server error updating budget' });
  }
});

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete a budget
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error('Error deleting budget:', err);
    res.status(500).json({ message: 'Server error deleting budget' });
  }
});

module.exports = router;
