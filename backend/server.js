const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://josephpeterjece2021:AJ9Hg6xTtQBUCoGr@cluster1.xaacunv.mongodb.net/ExpenseSharing?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));
  
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
  });
  
  const expenseSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    splitMethod: String,
    participants: [{ participantId :String, amountOwed: Number }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
  
  const User = mongoose.model('User', userSchema);
  const Expense = mongoose.model('Expense', expenseSchema);
  
  const secret = 'mysecret'; 
  
  // Register a new user
  app.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();
    res.json({ message: 'User registered successfully' });
  });
  
  // Login user 
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
  
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    
    res.json(user);
  });
  

  // Protected route to add expense
  app.post('/expenses',  async (req, res) => {
    const { description, amount, splitMethod, participants,createdBy } = req.body;
    const expense = new Expense({ description, amount, splitMethod, participants, createdBy });
   
    await expense.save();
    res.json(expense); 
  });
  
  app.post('/users', async (req, res) => {
    const { name, email, mobile } = req.body;
    const user = new User({ name, email, mobile });
    await user.save();
    res.json(user); 
  });
  
  app.get('/users', async (req, res) => {
    const user = await User.find(req.params.id);
    res.json(user);
  });

  app.get('/singleuser/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ name: user.name });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  //Individual User
  app.get('/expenses/user/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const userExpenses = await Expense.find({ 'participants': { $elemMatch: { participantId: userId } } });

      res.json(userExpenses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expenses for user' });
    }
  });

//all users expense
app.get('/expenses', async (req, res) => {
    try {
      const allExpenses = await Expense.find().populate('createdBy', 'name'); 
      res.json(allExpenses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all expenses' });
    }
  });
  
  
 
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });