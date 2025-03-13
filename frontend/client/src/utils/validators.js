/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates a password
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const validatePassword = (password) => {
  // At least 8 characters, 1 number, 1 uppercase, 1 lowercase, 1 special character
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};

/**
 * Calculates password strength
 * @param {string} password - The password to evaluate
 * @returns {number} - Strength percentage (0-100)
 */
export const calculatePasswordStrength = (password) => {
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
}; 