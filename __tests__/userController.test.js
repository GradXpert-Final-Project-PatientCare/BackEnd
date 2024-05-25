const UserController = require("../src/controllers/userController");
const { User } = require("../src/models");

jest.mock("../src/models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../src/helpers/bcrypt", () => ({
  comparePassword: jest.fn(),
}));

jest.mock("../src/helpers/jwt", () => ({
  generateToken: jest.fn(),
}));

const mockNext = jest.fn();

describe("UserController", () => {
  describe("Register", () => {
    it("should return 400 if field is empty", async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error(`Fields cannot be empty`);
      error.status = 400;

      await UserController.Register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 409 if user already existed", async () => {
      const req = {
        body: {
          username: "existing",
          email: "existing@example.com",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeUser = {
        id: "existing-id",
        email: req.body.email,
        password: "correcthashedpassword",
      };

      User.findOne.mockResolvedValue(fakeUser);

      const error = new Error(`email already taken`);
      error.status = 409;

      await UserController.Register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 401 invalid email format", async () => {
      const req = {
        body: {
          username: "user",
          email: "wrong email format",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      User.findOne.mockResolvedValue(null);

      const error = new Error(`invalid email format`);
      error.status = 401;

      await UserController.Register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 201 if register is successful", async () => {
      const req = {
        body: {
          username: "user",
          email: "user@gmail.com",
          password: "password",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      User.findOne.mockResolvedValue(null);

      await UserController.Register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
  describe("Login", () => {
    it("should return 400 if field is empty", async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error(`Fields cannot be empty`);
      error.status = 400;

      await UserController.Login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 401 if user is not found", async () => {
      const req = {
        body: { email: "nonexisting@example.com", password: "password" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      User.findOne.mockResolvedValue(null);

      const error = new Error(`Invalid email or password`);
      error.status = 401;

      await UserController.Login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 401 if password is incorrect", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeUser = {
        id: "existing-id",
        email: req.body.email,
        password: "correcthashedpassword",
      };
      User.findOne.mockResolvedValue(fakeUser);
      require("../src/helpers/bcrypt").comparePassword.mockReturnValue(false);

      const error = new Error(`Invalid email or password`);
      error.status = 401;

      await UserController.Login(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return token and user details if login is successful", async () => {
      const req = {
        body: { email: "test@example.com", password: "wrongpassword" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeUser = {
        id: "existing-id",
        email: req.body.email,
        password: "correcthashedpassword",
        username: "user",
      };
      User.findOne.mockResolvedValue(fakeUser);
      require("../src/helpers/bcrypt").comparePassword.mockReturnValue(true);
      require("../src/helpers/jwt").generateToken.mockReturnValue(
        "generated-token"
      );

      await UserController.Login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successfully retrieve user profile",
        status: 200,
        data: {
          accessToken: "generated-token",
          email: "test@example.com",
          username: fakeUser.username,
          rules: [
            {
              action: ["read", "create", "update"],
              subject: "Appointment",
            },
            {
              action: ["read"],
              subject: "Doctor",
            },
            {
              action: ["read"],
              subject: "Schedule",
            },
            {
              action: ["read"],
              subject: "Timeslot",
            },
            {
              action: ["read"],
              subject: "User",
            },
          ],
        },
      });
    });
  });
  describe("Profile", () => {
    it("should return 403 permission not authorized", async () => {
      const req = {
        ability: {
          can: jest.fn(),
        },
        user: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      req.ability.can.mockReturnValue(false);

      const error = new Error(`Forbidden resource`);
      error.status = 403;

      await UserController.Profile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it("should return 404 if user is not found", async () => {
      const req = {
        ability: {
          can: jest.fn(),
        },
        user: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      req.ability.can.mockReturnValue(true);
      User.findOne.mockResolvedValue(null);

      const error = new Error(`User requested not found`);
      error.status = 404;

      await UserController.Profile(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it("should return user if found", async () => {
      const req = {
        ability: {
          can: jest.fn(),
        },
        user: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeUser = {
        id: "existing-id",
        username: "testuser",
        email: "test@example.com",
        phone_number: "1234567890",
      };

      req.ability.can.mockReturnValue(true);
      User.findOne.mockResolvedValue(fakeUser);

      await UserController.Profile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 401 if User.findOne throws an error", async () => {
      const req = {
        ability: {
          can: jest.fn(),
        },
        user: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeUser = {
        id: "existing-id",
        username: "testuser",
        email: "test@example.com",
        phone_number: "1234567890",
      };

      req.ability.can.mockReturnValue(true);
      User.findOne.mockRejectedValue(new Error("Database error"));

      await UserController.Profile(req, res, next);

      const error = new Error(`Database error`);
      expect(next).toHaveBeenCalledWith(error);
      error.status = 401;
    });
  });
});
