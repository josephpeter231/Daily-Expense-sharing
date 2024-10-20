const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();



router.post('/expenses', async (req, res) => {
  const { description, amount, splitMethod, participants, createdBy, exactSplits = {}, percentSplits = {} } = req.body;

  let calculatedParticipants = [];

  // main logic for handling the splits 
  /**
   * 1. If equal split method is chosen then splits equally
   * 2. If Exact method is done the splitting based on entered amount.
   * 3. If percentage is given then the total amount is split based on the percentage.
   * 
   */
  const totalExactSplits = Object.values(exactSplits).reduce((a, b) => a + Number(b), 0);
  const totalPercentSplits = Object.values(percentSplits).reduce((a, b) => a + Number(b), 0);

  if (splitMethod === 'Equal') {
    const equalShare = (amount / (participants.length + 1)).toFixed(2);
    calculatedParticipants = [
      { participantId: createdBy, amountOwed: equalShare },
      ...participants.map(p => ({ participantId: p, amountOwed: equalShare }))
    ];
  } else if (splitMethod === 'Exact') {
    if (totalExactSplits > amount) {
      return res.status(400).json({ message: 'The total of exact amounts cannot exceed the total expense amount.' });
    }
    const remainingAmount = amount - totalExactSplits;
    calculatedParticipants = [
      { participantId: createdBy, amountOwed: remainingAmount.toFixed(2) },
      ...participants.map(p => {
        const owedAmount = parseFloat(exactSplits[p]) || 0;
        return { participantId: p, amountOwed: owedAmount.toFixed(2) };
      })
    ];
  } else if (splitMethod === 'Percentage') {
    if (totalPercentSplits > 100) {
      return res.status(400).json({ message: 'The total of percentages cannot exceed 100%.' });
    }
    const remainingAmount = amount - (amount * (totalPercentSplits / 100));
    calculatedParticipants = [
      { participantId: createdBy, amountOwed: remainingAmount.toFixed(2) },
      ...participants.map(p => {
        const percentage = parseFloat(percentSplits[p]) || 0;
        return { participantId: p, amountOwed: (amount * (percentage / 100)).toFixed(2) };
      })
    ];
  } else {
    return res.status(400).json({ message: 'Invalid split method' });
  }

  try {
    const expense = new Expense({
      description,
      amount,
      splitMethod,
      participants: calculatedParticipants,
      createdBy
    });
    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
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
