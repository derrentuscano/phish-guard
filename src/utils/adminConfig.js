// List of admin email addresses
const ADMIN_EMAILS = [
  'phishguardcontact@gmail.com'
];

/**
 * Check if an email belongs to an admin user
 * @param {string} email - User email to check
 * @returns {string} - Returns 'admin' if admin email, otherwise 'user'
 */
export const getUserRole = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
};

/**
 * Check if an email is an admin email
 * @param {string} email - User email to check
 * @returns {boolean} - True if admin, false otherwise
 */
export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export default { getUserRole, isAdminEmail };
