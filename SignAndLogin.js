document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const toggleIcon = document.getElementById('toggle-icon');
    const container = document.querySelector('.container');
    const body = document.body;

    // Fade in the container
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);

    // Dark Mode Toggle
    toggleIcon.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    // Retrieve users and current user from local storage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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
                window.location.href = 'login.html';
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

    // Prevent back navigation
    window.addEventListener('popstate', () => {
        window.history.pushState(null, null, window.location.href);
        alert('You cannot navigate back. Please logout first.');
        window.location.href = 'expense.html'; // Redirect back to the expense page
    });

    // Disable arrow key navigation and Alt + arrow combinations
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            alert('Navigation is disabled. Please logout to exit.');
        }
    });

    document.getElementById('logout').addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});
