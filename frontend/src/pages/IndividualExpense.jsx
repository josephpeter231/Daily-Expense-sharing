import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const IndividualExpenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [userMap, setUserMap] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`http://localhost:5000/expenses/user/${userId}`);
                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error('Error fetching individual expenses:', error);
            }
        };

        fetchExpenses();
    }, [userId]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                const data = await response.json();

                const map = {};
                data.forEach(user => {
                    map[user._id] = user.name;
                });
                setUserMap(map);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const downloadExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Description', 'Amount', 'Split Method', 'My Expense', 'Participants'],
            ...expenses.map(expense => [
                expense.description,
                expense.amount,
                expense.splitMethod,
                expense.participants.find(participant => participant.participantId === userId)?.amountOwed || 0,
                expense.participants.map(participant => `${userMap[participant.participantId] || 'Unknown'} owes ${participant.amountOwed} Rs`).join(', ')
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Individual Expenses');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'Individual_Expenses.xlsx');
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const tableData = expenses.map(expense => [
            expense.description,
            expense.amount,
            expense.splitMethod,
            expense.participants.find(participant => participant.participantId === userId)?.amountOwed || 0,
            expense.participants.map(participant => `${userMap[participant.participantId] || 'Unknown'} owes ${participant.amountOwed} Rs`).join(', ')
        ]);

        doc.autoTable({
            head: [['Description', 'Amount', 'Split Method', 'My Expense', 'Participants']],
            body: tableData
        });

        doc.save('Individual_Expenses.pdf');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Your Expenses</h2>
            <div className="mb-3 text-right">
                <button className="btn btn-primary mr-2" onClick={downloadExcel}>Download as Excel</button>
                <button className="btn btn-danger" onClick={downloadPDF}>Download as PDF</button>
            </div>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Split Method</th>
                        <th>My Expense</th>
                        <th>Participants</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map(expense => (
                        <tr key={expense._id}>
                            <td>{expense.description}</td>
                            <td>{expense.amount}</td>
                            <td>{expense.splitMethod}</td>
                            <td>
                                <ul>
                                    {expense.participants.map((participantObj, index) => {
                                        if (participantObj.participantId !== userId) {
                                            return null;
                                        }
                                        return (
                                            <li key={index}>
                                                {participantObj.amountOwed} Rs
                                            </li>
                                        );
                                    })}
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {expense.participants.map((participantObj, index) => {
                                        if (participantObj.participantId === userId) {
                                            return null;
                                        }
                                        return (
                                            <li key={index}>
                                                {userMap[participantObj.participantId] || 'Unknown'} owes {participantObj.amountOwed} Rs
                                            </li>
                                        );
                                    })}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IndividualExpenses;
