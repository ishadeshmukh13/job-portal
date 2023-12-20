import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt with automatic salt generation.
 * @param {string} plainPassword - The plain text password to be hashed.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
export const hashPassword = async (plainPassword) => {
  try {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw error;
  }
};

/**
 * Compare a plain text password with a hashed password.
 * @param {string} plainPassword - The plain text password to be compared.
 * @param {string} hashedPassword - The hashed password to be compared against.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the passwords match.
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
};