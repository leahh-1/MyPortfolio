// DOM Elements
const avatar = document.getElementById('avatar');
const dropdownMenu = document.getElementById('dropdownMenu');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const userName = document.querySelector('.user-name');
const userEmail = document.querySelector('.user-email');

// Toggle dropdown menu
avatar.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!avatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Show/Hide Forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    if (dropdownMenu) dropdownMenu.classList.remove('active');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    if (dropdownMenu) dropdownMenu.classList.remove('active');
});

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (dropdownMenu) dropdownMenu.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Handle Login
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Check if user exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const user = existingUsers.find(user => user.email === email);

        if (!user) {
            alert('No account found with this email. Please sign up first!');
            // Switch to signup form
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            return;
        }

        // Verify password
        if (user.password !== password) {
            alert('Incorrect password. Please try again!');
            return;
        }
        
        // Store user data using shared auth
        auth.setUser(user);
        
        // Show success message and redirect
        alert(`Welcome back, ${user.name}! 🎉 We're excited to have you here. Enjoy your experience!`);
        window.location.href = 'index.html';
        
        // Hide login form
        loginForm.classList.add('hidden');
    } catch (error) {
        alert('Invalid email or password');
    }
});

// Handle Signup
document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(user => user.email === email);

        if (userExists) {
            alert('An account with this email already exists. Please login instead!');
            // Switch to login form
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            return;
        }

        // Store the new user in users list
        const newUser = { email, name, password };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        // Store user data using shared auth
        auth.setUser(newUser);
        
        // Show success message and redirect
        alert(`Welcome to our community, ${newUser.name}! 🌟 Thank you for joining us. We're thrilled to have you on board!`);
        window.location.href = 'index.html';
        
        // Hide signup form
        signupForm.classList.add('hidden');
    } catch (error) {
        alert('Error creating account');
    }
});

// Handle Logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    auth.removeUser();
    dropdownMenu.classList.remove('active');
    alert('Logged out successfully');
});

// Update user menu based on login status
function updateUserMenu(user) {
    if (user) {
        // User is logged in
        userName.textContent = user.name;
        userEmail.textContent = user.email;
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        // User is not logged in
        userName.textContent = 'Guest';
        userEmail.textContent = 'Not logged in';
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    updateUserMenu(user);
}); 