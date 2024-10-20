const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  splitMethod: String,
  participants: [{ participantId: String, amountOwed: Number }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Expense', expenseSchema);
