const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();

// Add new expense
router.post('/expenses', async (req, res) => {
  const { description, amount, splitMethod, participants, createdBy } = req.body;
  const expense = new Expense({ description, amount, splitMethod, participants, createdBy });
  await expense.save();
  res.json(expense);
});

// Get expenses for a user
router.get('/expenses/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userExpenses = await Expense.find({ 'participants': { $elemMatch: { participantId: userId } } });
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses for user' });
  }
});

// Get all expenses
router.get('/expenses', async (req, res) => {
  try {
    const allExpenses = await Expense.find().populate('createdBy', 'name');
    res.json(allExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all expenses' });
  }
});

module.exports = router;
