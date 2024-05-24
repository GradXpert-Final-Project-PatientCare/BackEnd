const errorHandler = require("../src/middlewares/error");

const mockResponse = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};
const next = jest.fn();

describe("Error Handler Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle given errors", () => {
    const error = new Error(`Authentication Error`);
    error.status = 401;

    errorHandler(error, {}, mockResponse, next);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Authentication Error",
      status: 401
    });
  });

  test("should handle internal server errors", () => {
    const error = new Error();

    errorHandler(error, {}, mockResponse, next);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      status: 500
    });
  });
});
