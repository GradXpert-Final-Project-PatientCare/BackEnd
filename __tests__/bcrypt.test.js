const { hashPassword, comparePassword } = require('../src/helpers/bcrypt');

describe('Password Hashing and Comparison', () => {
    const userPassword = 'mySecretPassword';
    let hashedPassword;

    beforeAll(() => {
        hashedPassword = hashPassword(userPassword);
    });

    test('hashPassword should generate a hashed password', () => {
        expect(hashedPassword).toBeDefined();
        expect(hashedPassword).not.toBeNull();
        expect(typeof hashedPassword).toBe('string');
    });

    test('comparePassword should return true for correct password', () => {
        const isMatch = comparePassword(userPassword, hashedPassword);
        expect(isMatch).toBe(true);
    });

    test('comparePassword should return false for incorrect password', () => {
        const isMatch = comparePassword('wrongPassword', hashedPassword);
        expect(isMatch).toBe(false);
    });
});
