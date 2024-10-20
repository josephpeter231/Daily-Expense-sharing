import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 

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
    let calculatedParticipants = [];
    const totalExactSplits = Object.values(exactSplits).reduce((a, b) => a + Number(b), 0);
    const totalPercentSplits = Object.values(percentSplits).reduce((a, b) => a + Number(b), 0);

    if (splitMethod === 'Equal') {
      const equalShare = (amount / (participants.length + 1)).toFixed(2);
      calculatedParticipants = [
        { participantId: createdBy, amountOwed: equalShare }, // Creator's share
        ...participants.map(p => ({ participantId: p, amountOwed: equalShare })) // Participants' shares
      ];
    } else if (splitMethod === 'Exact') {
      if (totalExactSplits > amount) {
        alert('The total of exact amounts cannot exceed the total expense amount.');
        return;
      }

      const remainingAmount = amount - totalExactSplits; // Remaining amount for the creator
      calculatedParticipants = [
        { participantId: createdBy, amountOwed: remainingAmount.toFixed(2) }, // Creator's remaining share
        ...participants.map(p => ({ participantId: p, amountOwed: exactSplits[p] || 0 })) // Participants' shares
      ];
    } else if (splitMethod === 'Percentage') {
      if (totalPercentSplits > 100) {
        alert('The total of percentages cannot exceed 100%.');
        return;
      }

      const remainingAmount = amount - (amount * (totalPercentSplits / 100)); // Remaining amount for creator
      calculatedParticipants = [
        { participantId: createdBy, amountOwed: remainingAmount.toFixed(2) }, // Creator's remaining share
        ...participants.map(p => {
          const percentage = percentSplits[p] || 0;
          return { participantId: p, amountOwed: (amount * (percentage / 100)).toFixed(2) }; // Participants' shares
        })
      ];
    }

    const expenseData = {
      description,
      amount: parseFloat(amount),
      splitMethod,
      participants: calculatedParticipants,
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

  const handleParticipantsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setParticipants(selectedOptions);
  };

  return (
    <div>
      <h1>Add Expense</h1>
      <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      
      <select onChange={handleSplitChange}>
        <option value="Equal">Equal</option>
        <option value="Exact">Exact</option>
        <option value="Percentage">Percentage</option>
      </select>

      <div>
        <h3>Select Participants:</h3>
        <select multiple onChange={handleParticipantsChange}>
          {allUsers.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>

      <button onClick={handleAddExpense}>Add Expense</button>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{splitMethod === 'Exact' ? 'Enter Exact Amounts' : 'Enter Percentages'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {participants.map(participantId => {
            const participant = allUsers.find(user => user._id === participantId);
            return (
              <div key={participantId}>
                <label>{participant?.name}</label>
                <input
                  type="number"
                  step="0.01" // Allow decimal input
                  placeholder={splitMethod === 'Exact' ? 'Enter amount' : 'Enter percentage'}
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
