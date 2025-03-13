document.addEventListener("DOMContentLoaded", function () {
    // Set up password strength meter
    setupPasswordStrengthMeter();
    
    // Set up form submissions
    setupForms();
    
    // Set up session management
    setupSessionManagement();
});

function setupPasswordStrengthMeter() {
    const passwordInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('strengthText');
    
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = `${strength}%`;
            
            // Update strength class
            strengthBar.className = 'strength-bar';
            if (strength < 40) {
                strengthBar.classList.add('progress-low');
                strengthText.textContent = 'Weak password';
            } else if (strength < 70) {
                strengthBar.classList.add('progress-medium');
                strengthText.textContent = 'Medium password';
            } else {
                strengthBar.classList.add('progress-high');
                strengthText.textContent = 'Strong password';
            }
        });
    }
}

function calculatePasswordStrength(password) {
    // Simple password strength calculation
    if (!password) return 0;
    
    let strength = 0;
    
    // Length contribution (up to 40%)
    strength += Math.min(password.length * 4, 40);
    
    // Character variety contribution
    if (/[A-Z]/.test(password)) strength += 10; // Uppercase
    if (/[a-z]/.test(password)) strength += 10; // Lowercase
    if (/[0-9]/.test(password)) strength += 10; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special characters
    
    // Complexity patterns
    if (/[A-Z].*[A-Z]/.test(password)) strength += 5; // Multiple uppercase
    if (/[a-z].*[a-z]/.test(password)) strength += 5; // Multiple lowercase
    if (/[0-9].*[0-9]/.test(password)) strength += 5; // Multiple numbers
    
    return Math.min(strength, 100);
}

function setupForms() {
    const passwordForm = document.getElementById('passwordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }
            
            // Validate password strength
            const strength = calculatePasswordStrength(newPassword);
            if (strength < 40) {
                showNotification('Password is too weak. Please choose a stronger password.', 'error');
                return;
            }
            
            // Send password update request
            updatePassword(currentPassword, newPassword);
        });
    }
    
    // Set up 2FA toggle
    const enableTwoFABtn = document.getElementById('enableTwoFABtn');
    if (enableTwoFABtn) {
        enableTwoFABtn.addEventListener('click', function() {
            showNotification('Two-factor authentication setup will be available soon.', 'info');
        });
    }
}

function updatePassword(currentPassword, newPassword) {
    const csrftoken = getCookie('csrftoken');
    
    fetch("http://127.0.0.1:8000/api/users/change-password/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken || '',
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        }),
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(JSON.stringify(data));
            });
        }
        return response.json();
    })
    .then(data => {
        showNotification('Password updated successfully', 'success');
        document.getElementById('passwordForm').reset();
    })
    .catch(error => {
        console.error('Error updating password:', error);
        try {
            const errorData = JSON.parse(error.message);
            let errorMessage = 'Failed to update password';
            
            if (errorData.current_password) {
                errorMessage = errorData.current_password;
            } else if (errorData.new_password) {
                errorMessage = errorData.new_password;
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            }
            
            showNotification(errorMessage, 'error');
        } catch (e) {
            showNotification('Failed to update password. Please try again.', 'error');
        }
    });
}

function setupSessionManagement() {
    const terminateButtons = document.querySelectorAll('.session-actions .btn-danger');
    const terminateAllBtn = document.getElementById('terminateAllBtn');
    
    terminateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, you would get the session ID from a data attribute
            const sessionId = this.closest('.session-item').dataset.sessionId || 'mock-session-id';
            terminateSession(sessionId);
        });
    });
    
    if (terminateAllBtn) {
        terminateAllBtn.addEventListener('click', function() {
            terminateAllSessions();
        });
    }
}

function terminateSession(sessionId) {
    // Mock implementation - in a real app, you would call your API
    console.log(`Terminating session: ${sessionId}`);
    showNotification('Session terminated successfully', 'success');
    
    // Remove the session from the UI
    const sessionElement = document.querySelector(`.session-item[data-session-id="${sessionId}"]`);
    if (sessionElement) {
        sessionElement.remove();
    }
}

function terminateAllSessions() {
    // Mock implementation - in a real app, you would call your API
    console.log('Terminating all other sessions');
    showNotification('All other sessions terminated successfully', 'success');
    
    // Remove all non-current sessions from the UI
    const sessionElements = document.querySelectorAll('.session-item:not(.current)');
    sessionElements.forEach(element => {
        element.remove();
    });
} 