# Daily Expenses Sharing Application

## Objective

Design and implement a backend for a daily-expenses sharing application. This application allows users to add expenses and split them based on three different methods: exact amounts, percentages, and equal splits. The application manages user details, validates inputs, and generates downloadable balance sheets.

## Requirements
#### Node.js
- **Version**: 14.x or later
- Install Node.js from [nodejs.org](https://nodejs.org/).

### User Management
- Each user should have an email, name, and mobile number.

### Expense Management
- Users can add expenses.
- Expenses can be split using three methods:
  1. **Equal**: Split equally among all participants.
  2. **Exact**: Specify the exact amount each participant owes.
  3. **Percentage**: Specify the percentage each participant owes. (Ensure percentages add up to 100%).

### Expense Calculation Examples
1. **Equal**:
   - **Scenario**: You go out with 3 friends. The total bill is 3000. Each friend owes 1000.
   
2. **Exact**:
   - **Scenario**: You go shopping with 2 friends and pay 4299. Friend 1 owes 799, Friend 2 owes 2000, and you owe 1500.
   
3. **Percentage**:
   - **Scenario**: You go to a party with 2 friends and one of your cousins. You owe 50%, Friend 1 owes 25%, and Friend 2 owes 25%.

### Balance Sheet
- Show individual expenses.
- Show overall expenses for all users.
- Provide a feature to download the balance sheet.

## Deliverables

### Backend Service
- Design the backend service to handle user and expense management.

### API Endpoints

#### User Endpoints
- **Create User**: 
  - `POST /users`
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890"
    }
    ```
  
- **Retrieve User Details**: 
  - `GET /users/:id`

#### Expense Endpoints
- **Add Expense**: 
  - `POST /expenses`
  - Request Body:
    ```json
    {
      "amount": 3000,
      "splitMethod": "equal",
      "participants": ["user1Id", "user2Id", "user3Id"]
    }
    ```

- **Retrieve Individual User Expenses**: 
  - `GET /expenses/user/:id`

- **Retrieve Overall Expenses**: 
  - `GET /expenses`

- **Download Balance Sheet**: 
  - `GET /expenses/balance-sheet`

## Data Validation
- Validate user inputs to ensure correctness.
- Ensure percentages in the percentage split method add up to 100%.

## Documentation
### Setup and Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/daily-expenses-sharing-app.git
   cd daily-expenses-sharing-app
