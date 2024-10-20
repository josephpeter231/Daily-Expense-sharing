import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddExpense from './pages/AddExpense';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import IndividualExpenses from './pages/IndividualExpense.jsx';
import OverallExpenses from './pages/OverallExpense.jsx';
import { useState } from 'react';
import AppNavbar from './pages/Navbar.jsx';
function App() {
  const [authToken, setAuthToken] = useState(null);

  const authHeader = () => ({ headers: { Authorization: authToken } });

  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
        <Route path="/add-expense" element={<AddExpense authHeader={authHeader} />} />
        <Route path="/individual-expense" element={<IndividualExpenses />} />
        <Route path="/overall-expenses" element={<OverallExpenses />} />
      </Routes>
    </Router>
  );
}

export default App;
