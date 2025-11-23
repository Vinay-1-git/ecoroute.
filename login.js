// Switch between login and signup forms
function switchToSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function switchToLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Email validation - must end with @gmail.com
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

// Real-time password validation for signup
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

// Handle Login
function handleLogin(event) {
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
    
    // Check if user exists
    const storedUser = localStorage.getItem(email);
    
    if (!storedUser) {
        document.getElementById('loginEmailError').textContent = 'Account not found. Please sign up.';
        isValid = false;
    } else {
        const userData = JSON.parse(storedUser);
        if (userData.password !== password) {
            document.getElementById('loginPasswordError').textContent = 'Incorrect password';
            isValid = false;
        }
    }
    
    if (isValid) {
        // Store current user session
        localStorage.setItem('currentUser', email);
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    }
    
    return false;
}

// Handle Signup
function handleSignup(event) {
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
    
    // Check if email already exists
    if (localStorage.getItem(email)) {
        document.getElementById('signupEmailError').textContent = 'Email already registered. Please login.';
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
    
    if (isValid) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            password: password
        };
        localStorage.setItem(email, JSON.stringify(userData));
        
        alert('Account created successfully! Please login.');
        switchToLogin();
    }
    
    return false;
}
