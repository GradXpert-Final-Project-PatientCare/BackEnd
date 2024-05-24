const { User } = require('../src/models');
const { verifyToken } = require('../src/helpers/jwt');
const authentication = require('../src/middlewares/authentication');

jest.mock('../src/models', () => ({
    User: {
        findOne: jest.fn()
    }
}));

jest.mock('../src/helpers/jwt', () => ({
    verifyToken: jest.fn()
}));

const mockNext = jest.fn();

describe('Authentication Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call next if user is authenticated', async () => {
        const userDecoded = { id: 1, email: 'test@example.com' };
        verifyToken.mockReturnValue(userDecoded);
        User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

        const req = {
            headers: {
                authorization: 'Bearer valid_token'
            }
        };
        const res = {};
        const next = mockNext;

        await authentication(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith('valid_token');
        expect(User.findOne).toHaveBeenCalledWith({
            where: { id: userDecoded.id, email: userDecoded.email }
        });
        expect(req.user).toEqual({ id: 1, email: 'test@example.com' });
        expect(next).toHaveBeenCalled();
    });

    test('should return 401 if user is not found', async () => {
        const userDecoded = { id: 1, email: 'test@example.com' };
        verifyToken.mockReturnValue(userDecoded);
        User.findOne.mockResolvedValue(null);

        const req = {
            headers: {
                authorization: 'Bearer valid_token'
            }
        };
        const res = {};
        const next = mockNext;

        const error = new Error(`Authentication Error`);
        error.status = 401;

        await authentication(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith('valid_token');
        expect(User.findOne).toHaveBeenCalledWith({
            where: { id: userDecoded.id, email: userDecoded.email }
        });
        expect(next).toHaveBeenCalledWith(error);
    });

    test('should return 401 if token not given', async () => {
        const userDecoded = { id: 1, email: 'test@example.com' };
        verifyToken.mockReturnValue(userDecoded);

        const req = {
            headers: {
                authorization: 'Bearer '
            }
        };
        const res = {};
        const next = mockNext;

        const error = new Error(`Authentication Error`);
        error.status = 401;

        await authentication(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    test('should return 401 if User.findOne throws an error', async () => {
        const userDecoded = { id: 1, email: 'test@example.com' };
        verifyToken.mockReturnValue(userDecoded);
        User.findOne.mockRejectedValue(new Error('Database error'));

        const req = {
            headers: {
                authorization: 'Bearer valid_token'
            }
        };
        const res = {};
        const next = mockNext;

        const error = new Error(`Authentication Error`);
        error.status = 401;

        await authentication(req, res, next);

        expect(verifyToken).toHaveBeenCalledWith('valid_token');
        expect(User.findOne).toHaveBeenCalledWith({
            where: { id: userDecoded.id, email: userDecoded.email }
        });
        expect(next).toHaveBeenCalledWith(error);
    });
});
