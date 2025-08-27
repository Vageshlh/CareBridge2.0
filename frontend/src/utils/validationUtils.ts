/**
 * Validation utility functions for form validation
 */

/**
 * Validate an email address
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validate a password (at least 8 characters, including at least one uppercase letter, 
 * one lowercase letter, one number, and one special character)
 * @param password - Password to validate
 * @returns Boolean indicating if the password is valid
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate a phone number (10 digits, can include spaces, dashes, or parentheses)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

/**
 * Validate a name (at least 2 characters, letters only)
 * @param name - Name to validate
 * @returns Boolean indicating if the name is valid
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
};

/**
 * Validate a URL
 * @param url - URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validate a date (must be a valid date)
 * @param dateString - Date string to validate
 * @returns Boolean indicating if the date is valid
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validate a future date (must be a valid date in the future)
 * @param dateString - Date string to validate
 * @returns Boolean indicating if the date is valid and in the future
 */
export const isValidFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return !isNaN(date.getTime()) && date > now;
};

/**
 * Validate a zip code (5 digits)
 * @param zipCode - Zip code to validate
 * @returns Boolean indicating if the zip code is valid
 */
export const isValidZipCode = (zipCode: string): boolean => {
  return /^\d{5}(-\d{4})?$/.test(zipCode);
};

/**
 * Validate a credit card number using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns Boolean indicating if the credit card number is valid
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};