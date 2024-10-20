# Daily Expenses Sharing Application

## Objective

Design and implement a backend for a daily-expenses sharing application. This application allows users to add expenses and split them based on three different methods: exact amounts, percentages, and equal splits. The application manages user details, validates inputs, and generates downloadable balance sheets.

## Requirements
#### Node.js
- **Version**: 14.x or later
- Install Node.js from [nodejs.org](https://nodejs.org/).

### User Management
- Each user should have an email, name, and mobile number.
- Registeration and Login can be done.

### Expense Management
- Users can add expenses.
- Expenses can be split using three methods:
  1. **Equal**: Split equally among all participants.
  2. **Exact**: Specify the exact amount each participant owes.
  3. **Percentage**: Specify the percentage each participant owes.


### Balance Sheet
- Show individual expenses.
- Show overall expenses for all users.
- Users can download the balance sheet in excel or pdf.

## 

### API Endpoints

#### User Endpoints
- **Create User**: 
  - `POST /users`
  
- **Get Single User**: 
  - `GET /singleuser/:id`

- **Login User**: 
  - `POST /login`

- **Get All Users**: 
  - `GET /users`

#### Expense Endpoints
- **Add Expense**: 
  - `POST /expenses`

- **Retrieve Individual User Expenses**: 
  - `GET /expenses/user/:id`

- **Retrieve Overall Expenses**: 
  - `GET /expenses`

- **Download Balance Sheet**: 
  - `GET /expenses/balance-sheet`

## Data Validation
- [x] Validate user inputs to ensure correctness.
- Ensure percentages in the percentage split method add up to 100%.
- During exact split greater than the original amount cannot be done.

## Documentation
### Setup and Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/josephpeter231/Daily-Expense-sharing/
   cd backend
   npm install 
   nodemon server
2. Make sure it displays `Server is running on port 5000`
   (or) run `nodemon server`.

### To run the frontend 

1. ```bash
   cd frontend
   npm install 
   npm run dev 

