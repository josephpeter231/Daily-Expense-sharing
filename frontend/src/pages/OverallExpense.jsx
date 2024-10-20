import { useState, useEffect,Fragment } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dropdown } from 'react-bootstrap'; // Import Dropdown from react-bootstrap

const OverallUserExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [userExpenses, setUserExpenses] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  // Fetch all users and create a map
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        const users = response.data;

        const map = {};
        users.forEach(user => {
          map[user._id] = user.name; // Map userId to user name
        });
        setUserMap(map);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/expenses');
        const allExpenses = response.data;

        const expenseMap = {};
        let total = 0;

        allExpenses.forEach(expense => {
          expense.participants.forEach(participant => {
            if (!expenseMap[participant.participantId]) {
              expenseMap[participant.participantId] = {
                totalExpense: 0,
                expenseDetails: []
              };
            }

            const amountOwed = parseFloat(participant.amountOwed);
            expenseMap[participant.participantId].totalExpense += amountOwed;
            expenseMap[participant.participantId].expenseDetails.push({
              description: expense.description,
              amountOwed: amountOwed
            });

            total += amountOwed;
          });
        });

        setExpenses(allExpenses);
        setUserExpenses(expenseMap);
        setGrandTotal(total);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  // Download as Excel
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsData = [
      ['User', 'Expense Description', 'Amount Owed'],
      ...Object.keys(userExpenses).flatMap(userId =>
        userExpenses[userId].expenseDetails.map((expenseDetail, index) => [
          index === 0 ? userMap[userId] || 'Unknown' : '',
          expenseDetail.description,
          expenseDetail.amountOwed.toFixed(2)
        ])
      ),
      ['', 'Grand Total', grandTotal.toFixed(2)]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Overall Expenses');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Overall_Expenses.xlsx');
  };

  // Download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableData = Object.keys(userExpenses).flatMap(userId =>
      userExpenses[userId].expenseDetails.map((expenseDetail, index) => [
        index === 0 ? userMap[userId] || 'Unknown' : '',
        expenseDetail.description,
        expenseDetail.amountOwed.toFixed(2)
      ])
    );

    doc.autoTable({
      head: [['User', 'Expense Description', 'Amount Owed']],
      body: [...tableData, ['', 'Grand Total', grandTotal.toFixed(2)]]
    });

    doc.save('Overall_Expenses.pdf');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Overall Expenses for All Users</h2>
      <div className="mb-3 text-right">
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Download Balance Sheet
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={downloadExcel}>Download as Excel</Dropdown.Item>
            <Dropdown.Item onClick={downloadPDF}>Download as PDF</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">User</th>
            <th scope="col">Expense Description</th>
            <th scope="col">Amount Owed</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(userExpenses).map(userId => (
            <Fragment key={userId}>
              {userExpenses[userId].expenseDetails.map((expenseDetail, index) => (
                <tr key={`${userId}-${index}`}>
                  <td>{index === 0 ? userMap[userId] || 'Unknown' : ''}</td>
                  <td>{expenseDetail.description}</td>
                  <td>${expenseDetail.amountOwed.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="table-info">
                <td><strong>{userMap[userId]}</strong></td>
                <td><strong>Total:</strong></td>
                <td><strong>${userExpenses[userId].totalExpense.toFixed(2)}</strong></td>
              </tr>
            </Fragment>
          ))}
          <tr className="table-success">
            <td colSpan="2" className="text-right"><strong>Grand Total</strong></td>
            <td><strong>${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OverallUserExpenses;
