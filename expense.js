document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const splitResult = document.getElementById('split-result');
    const splitList = document.getElementById('split-list');
    const welcomeMessage = document.getElementById('welcome-message');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Logout button working 
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Add Expense of the user
    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('description').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const expense = { id: generateID(), email: currentUser.email, description, amount };

            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            addExpenseToDOM(expense);
            updateTotalAndSplit();

            expenseForm.reset();
        });
    }

    // Generate a random ID for the transactions
    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }

    // Add Expense to array of objects
    function addExpenseToDOM(expense) {
        const item = document.createElement('li');
        const user = users.find(user => user.email === expense.email);

        item.innerHTML = `
            ${expense.description}: ₹${expense.amount} (by ${user.username})
        `;

        expenseList.appendChild(item);
    }

    // splitting and total 
    function updateTotalAndSplit() {
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
        totalAmount.innerText = `₹${total}`;

        const loggedInUsers = users.filter(user => expenses.some(expense => expense.email === user.email));
        const perPerson = (total / loggedInUsers.length).toFixed(2);
        splitResult.innerText = `Each person should pay: ₹${perPerson}`;

        splitList.innerHTML = '';
        loggedInUsers.forEach(user => {
            const li = document.createElement('li');
            li.innerText = `${user.username} should pay ₹${perPerson}`;
            splitList.appendChild(li);
        });
    }

    // welcome page message for the user 
    function init() {
        if (currentUser) {
            if (welcomeMessage) {
                welcomeMessage.innerText = `Welcome, ${currentUser.username}!`;
            }
            if (expenseList) {
                expenses.forEach(addExpenseToDOM);
                updateTotalAndSplit();
            }
        }
    }

    init();
});
