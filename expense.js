document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
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

    // Handle Sign Up
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            if (users.some(user => user.email === email)) {
                alert('Email already exists');
            } else {
                const newUser = { email, username, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                alert('Sign up successful. You can now log in.');
                signupForm.reset();
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = users.find(user => user.email === email && user.password === password);
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'expense.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    // Handle Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Add Expense
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

    // Generate a random ID
    function generateID() {
        return Math.floor(Math.random() * 1000000000);
    }

    // Add Expense to DOM
    function addExpenseToDOM(expense) {
        const item = document.createElement('li');
        const user = users.find(user => user.email === expense.email);

        item.innerHTML = `
            ${expense.description}: ₹${expense.amount} (by ${user.username})
        `;

        expenseList.appendChild(item);
    }

    // Update Total and Split
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

    // Initialize App
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
