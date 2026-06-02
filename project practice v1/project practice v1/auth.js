// Shared authentication functionality
const auth = {
    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Set user data
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
    },

    // Remove user data
    removeUser() {
        localStorage.removeItem('user');
        this.updateUI();
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // Check if login page access is allowed
    checkLoginAccess() {
        if (this.isLoggedIn()) {
            alert('Another user is already logged in. Please log out first.');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    // Update UI elements based on login status
    updateUI() {
        const user = this.getCurrentUser();
        const userName = document.querySelector('.user-name');
        const userEmail = document.querySelector('.user-email');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userName && userEmail && loginBtn && signupBtn && logoutBtn) {
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
    },

    // Initialize auth functionality
    init() {
        // Update UI on page load
        this.updateUI();

        // Check if we're on the login page
        if (window.location.pathname.includes('login.html')) {
            if (!this.checkLoginAccess()) {
                return; // Stop initialization if login access is not allowed
            }
        }

        // Add event listeners for user menu
        const avatar = document.getElementById('avatar');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');

        // Toggle dropdown menu
        if (avatar && dropdownMenu) {
            // Remove any existing click listeners
            const newAvatar = avatar.cloneNode(true);
            avatar.parentNode.replaceChild(newAvatar, avatar);

            // Add click listener to new avatar
            newAvatar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!newAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('active');
                }
            });

            // Handle login/signup button clicks
            if (loginBtn) {
                loginBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdownMenu.classList.remove('active');
                    
                    if (!auth.checkLoginAccess()) {
                        return;
                    }
                    
                    window.location.href = 'login.html';
                });
            }

            if (signupBtn) {
                signupBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdownMenu.classList.remove('active');
                    window.location.href = 'login.html';
                });
            }
        }

        // Add logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeUser();
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('active');
                }
                // Redirect to home page after logout
                window.location.href = 'index.html';
            });
        }
    }
};

// Initialize auth state when page loads
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});