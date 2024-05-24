const notFound = require("../src/middlewares/notFound");

const next = jest.fn();

describe("Error Handler Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should handle not found error if routes not found", () => {
    const error = new Error(`Not Found`);
    error.status = 404;
    
    notFound({}, {}, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
