// Switch between login and signup forms
function switchToSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function switchToLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Email validation
function validateEmail(email) {
    return email.endsWith('@gmail.com');
}

// Password validation
function validatePassword(password) {
    const rules = {
        length: password.length >= 8,
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        number: /\d/.test(password),
        uppercase: /[A-Z]/.test(password)
    };
    return rules;
}

// Real-time password validation
document.addEventListener('DOMContentLoaded', function() {
    const signupPassword = document.getElementById('signupPassword');
    
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const rules = validatePassword(this.value);
            
            document.getElementById('rule-length').classList.toggle('valid', rules.length);
            document.getElementById('rule-special').classList.toggle('valid', rules.special);
            document.getElementById('rule-number').classList.toggle('valid', rules.number);
            document.getElementById('rule-uppercase').classList.toggle('valid', rules.uppercase);
        });
    }
});

// ⭐ Handle Login with Backend Connection
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Clear previous errors
    document.getElementById('loginEmailError').textContent = '';
    document.getElementById('loginPasswordError').textContent = '';
    
    let isValid = true;
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('loginEmailError').textContent = 'Email must end with @gmail.com';
        isValid = false;
    }
    
    if (!isValid) return false;
    
    // ⭐ Try to connect to backend first
    if (typeof API !== 'undefined') {
        try {
            // Show loading indicator
            const loginBtn = event.target.querySelector('button[type="submit"]');
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'Connecting...';
            loginBtn.disabled = true;
            
            // Call backend API
            const result = await API.login({ email, password });
            
            if (result.success) {
                // Backend authentication successful
                localStorage.setItem('currentUser', email);
                localStorage.setItem('userName', result.data.user.name || 'User');
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                // Backend authentication failed
                document.getElementById('loginPasswordError').textContent = 
                    result.data?.message || 'Login failed. Please try again.';
            }
            
            // Restore button
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            
        } catch (error) {
            console.log('Backend unavailable, using local storage...');
            // Fallback to localStorage if backend is not available
            loginWithLocalStorage(email, password);
        }
    } else {
        // No API available, use localStorage
        loginWithLocalStorage(email, password);
    }
    
    return false;
}

// Fallback login using localStorage
function loginWithLocalStorage(email, password) {
    const storedUser = localStorage.getItem(email);
    
    if (!storedUser) {
        document.getElementById('loginEmailError').textContent = 'Account not found. Please sign up.';
        return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.password !== password) {
        document.getElementById('loginPasswordError').textContent = 'Incorrect password';
        return;
    }
    
    localStorage.setItem('currentUser', email);
    alert('Login successful!');
    window.location.href = 'dashboard.html';
}

// ⭐ Handle Signup with Backend Connection
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous errors
    document.getElementById('signupEmailError').textContent = '';
    document.getElementById('signupPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    
    let isValid = true;
    
    // Validate email
    if (!validateEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Email must end with @gmail.com';
        isValid = false;
    }
    
    // Validate password
    const passwordRules = validatePassword(password);
    if (!passwordRules.length || !passwordRules.special || !passwordRules.number || !passwordRules.uppercase) {
        document.getElementById('signupPasswordError').textContent = 'Password does not meet all requirements';
        isValid = false;
    }
    
    // Confirm password match
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (!isValid) return false;
    
    // ⭐ Try to connect to backend
    if (typeof API !== 'undefined') {
        try {
            // Show loading
            const signupBtn = event.target.querySelector('button[type="submit"]');
            const originalText = signupBtn.textContent;
            signupBtn.textContent = 'Creating Account...';
            signupBtn.disabled = true;
            
            // Call backend API
            const result = await API.signup({ name, email, password });
            
            if (result.success) {
                alert('Account created successfully! Please login.');
                switchToLogin();
            } else {
                document.getElementById('signupEmailError').textContent = 
                    result.data?.message || 'Signup failed. Email may already exist.';
            }
            
            // Restore button
            signupBtn.textContent = originalText;
            signupBtn.disabled = false;
            
        } catch (error) {
            console.log('Backend unavailable, using local storage...');
            signupWithLocalStorage(name, email, password);
        }
    } else {
        signupWithLocalStorage(name, email, password);
    }
    
    return false;
}

// Fallback signup using localStorage
function signupWithLocalStorage(name, email, password) {
    if (localStorage.getItem(email)) {
        document.getElementById('signupEmailError').textContent = 'Email already registered. Please login.';
        return;
    }
    
    const userData = { name, email, password };
    localStorage.setItem(email, JSON.stringify(userData));
    
    alert('Account created successfully! Please login.');
    switchToLogin();
}

// Show connection status
window.addEventListener('DOMContentLoaded', async () => {
    if (typeof checkBackendStatus !== 'undefined') {
        const isConnected = await checkBackendStatus();
        
        // Show status message
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            background: ${isConnected ? '#22c55e' : '#fbbf24'};
            color: white;
        `;
        statusDiv.textContent = isConnected ? '✓ Backend Connected' : '⚠ Using Offline Mode';
        document.body.appendChild(statusDiv);
        
        // Remove after 3 seconds
        setTimeout(() => statusDiv.remove(), 3000);
    }
});
