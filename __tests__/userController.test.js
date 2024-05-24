const UserController = require('../src/controllers/userController');
const { User } = require('../src/models');

jest.mock('../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  }
}));

jest.mock('../src/helpers/bcrypt', () => ({
  comparePassword: jest.fn(),
}));

jest.mock('../src/helpers/jwt', () => ({
  generateToken: jest.fn(),
}));

const mockNext = jest.fn();

describe('UserController', () => {
  describe('Login', () => {
    it('should return 400 if field is empty', async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error(`Fields cannot be empty`);
      error.status = 400;

      await UserController.Login(req, res, mockNext);

      expect(next).toHaveBeenCalledWith(error);
    });

    // it('should return 404 if user is not found', async () => {
    //   const req = { body: { email: 'nonexisting@example.com', password: 'password' } };
    //   const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    //   User.findOne.mockResolvedValue(null);

    //   await UserController.Login(req, res);

    //   expect(res.status).toHaveBeenCalledWith(404);
    //   expect(res.json).toHaveBeenCalledWith({ message: `User with email ${req.body.email} not found` });
    // });

    // it('should return 401 if password is incorrect', async () => {
    //   const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
    //   const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    //   const fakeUser = { id: 'existing-id', email: req.body.email, password: 'correcthashedpassword' };
    //   User.findOne.mockResolvedValue(fakeUser);
    //   require('../helpers/bcrypt').comparePassword.mockReturnValue(false);

    //   await UserController.Login(req, res);

    //   expect(res.status).toHaveBeenCalledWith(401);
    //   expect(res.json).toHaveBeenCalledWith({ message: `User's password with email ${req.body.email} does not match` });
    // });

    // it('should return token and user details if login is successful', async () => {
    //   const req = { body: { email: 'test@example.com', password: 'password' } };
    //   const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    //   const fakeUser = { id: 'existing-id', email: req.body.email, password: 'correcthashedpassword' };
    //   User.findOne.mockResolvedValue(fakeUser);
    //   require('../helpers/bcrypt').comparePassword.mockReturnValue(true);
    //   require('../helpers/jwt').generateToken.mockReturnValue('generated-token');

    //   await UserController.Login(req, res);

    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({ token: 'generated-token', user_id: fakeUser.id, username: fakeUser.username });
    // });
  });
});
