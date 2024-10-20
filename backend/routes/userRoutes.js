// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();
// const secret = process.env.JWT_SECRET;

// // Register a new user
// router.post('/register', async (req, res) => {
//   const { name, email, mobile, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ name, email, mobile, password: hashedPassword });
//   await user.save();
//   res.json({ message: 'User registered successfully' });
// });

// // Login user
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: 'User not found' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

//   const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
//   res.json({ user, token });
// });

// // Get all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // Get single user
// router.get('/singleuser/:id', async (req, res) => {
//   const userId = req.params.id;
  
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ name: user.name });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, mobile, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' }); // Change to 201
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Attempting login for email: ${email}`);
  const user = await User.findOne({ email });
  console.log(`Found user: ${user}`);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  res.status(200).json({ user, token });
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user
router.get('/singleuser/:id', async (req, res) => {
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

module.exports = router;
