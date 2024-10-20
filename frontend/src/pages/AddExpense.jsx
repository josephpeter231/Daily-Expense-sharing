import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddExpense.css'; 

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitMethod, setSplitMethod] = useState('Equal');
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [exactSplits, setExactSplits] = useState({});
  const [percentSplits, setPercentSplits] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const createdBy = user._id;

  useEffect(() => {
    axios.get('http://localhost:5000/users/')
      .then((response) => {
        const users = response.data.filter(u => u._id !== createdBy);
        setAllUsers(users);
      })
      .catch((err) => console.log(err));
  }, [createdBy]);

  const handleAddExpense = () => {
    if (splitMethod === 'Exact') {
      const totalExact = Object.values(exactSplits).reduce((a, b) => a + parseFloat(b || 0), 0);
      if (totalExact > parseFloat(amount)) {
        alert("Total exact splits cannot exceed the total expense amount.");
        return;
      }
    } else if (splitMethod === 'Percentage') {
      const totalPercent = Object.values(percentSplits).reduce((a, b) => a + parseFloat(b || 0), 0);
      if (totalPercent > 100) {
        alert("Total percentages cannot exceed 100%.");
        return;
      }
    }
  
    const expenseData = {
      description,
      amount: parseFloat(amount),
      splitMethod,
      participants,
      exactSplits,
      percentSplits,
      createdBy,
    };
  
    axios.post('http://localhost:5000/expenses', expenseData)
      .then(() => alert('Expense added successfully'))
      .catch((err) => alert('Error adding expense', err));
  };
  

  const handleSplitChange = (e) => {
    setSplitMethod(e.target.value);
    if (e.target.value === 'Exact' || e.target.value === 'Percentage') {
      setModalShow(true);
    }
  };

  const handleSplitDataChange = (userId, value, type) => {
    if (type === 'Exact') {
      setExactSplits(prev => ({ ...prev, [userId]: value }));
    } else {
      setPercentSplits(prev => ({ ...prev, [userId]: parseFloat(value) }));
    }
  };

  const handleParticipantsChange = (userId) => {
    setParticipants(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  return (
    <div className="add-expense-container">
      <h1 className="text-center">Add Expense</h1>
      <input 
        type="text" 
        className="form-control mb-3" 
        placeholder="Description" 
        onChange={(e) => setDescription(e.target.value)} 
      />
      <input 
        type="number" 
        className="form-control mb-3" 
        placeholder="Amount" 
        onChange={(e) => setAmount(e.target.value)} 
      />
      
      <select className="form-select mb-3" onChange={handleSplitChange}>
        <option value="Equal">Equal</option>
        <option value="Exact">Exact</option>
        <option value="Percentage">Percentage</option>
      </select>

      <div>
        <h3>Choose Users to share:</h3>
        <div className="participants-list">
          {allUsers.map(user => (
            <div key={user._id} className="participant-item">
              <input 
                type="checkbox" 
                id={user._id} 
                checked={participants.includes(user._id)} 
                onChange={() => handleParticipantsChange(user._id)} 
              />
              <label htmlFor={user._id}>{user.name}</label>
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleAddExpense}>Add Expense</button>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{splitMethod === 'Exact' ? 'Enter Exact Amounts' : 'Enter Percentages'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {participants.map(participantId => {
            const participant = allUsers.find(user => user._id === participantId);
            return (
              <div key={participantId} className="mb-2">
                <label>{participant?.name}</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={splitMethod === 'Exact' ? 'Enter amount' : 'Enter percentage'}
                  className="form-control"
                  onChange={(e) => handleSplitDataChange(participantId, e.target.value, splitMethod)}
                />
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddExpense;
