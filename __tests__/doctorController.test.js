const DoctorController = require("../src/controllers/doctorController");
const { Doctor } = require("../src/models");

jest.mock("../src/models", () => ({
  Doctor: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
}));

const mockNext = jest.fn();

describe("DoctorController", () => {
  describe("GetAllDoctors", () => {
    it("should return doctors with pagination and search", async () => {
      const req = {
        query: { page: 1, search: "John" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctors = {
        count: 1,
        rows: [{ id: 1, name: "John Doe" }],
      };
      Doctor.findAndCountAll.mockResolvedValue(fakeDoctors);

      await DoctorController.GetAllDoctors(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully retrieve doctors",
        data: fakeDoctors,
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        query: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Doctor.findAndCountAll.mockRejectedValue(error);

      await DoctorController.GetAllDoctors(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("GetDoctorByID", () => {
    it("should return doctor details if found", async () => {
      const req = {
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe", Schedules: [{}] };
      Doctor.findOne.mockResolvedValue(fakeDoctor);

      await DoctorController.GetDoctorByID(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if doctor is not found", async () => {
      const req = {
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Doctor.findOne.mockResolvedValue(null);

      const error = new Error("Doctor requested not found");
      error.status = 404;

      await DoctorController.GetDoctorByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Doctor.findOne.mockRejectedValue(error);

      await DoctorController.GetDoctorByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
