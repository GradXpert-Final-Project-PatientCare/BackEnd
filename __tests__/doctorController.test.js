const DoctorController = require("../src/controllers/doctorController");
const { Doctor } = require("../src/models");
const { Op } = require("sequelize");

jest.mock("../src/models", () => ({
  Doctor: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

const mockNext = jest.fn();

describe("DoctorController", () => {
  describe("GetAllDoctors", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        query: {},
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await DoctorController.GetAllDoctors(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return doctors with pagination and search", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
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
        ability: { can: jest.fn().mockReturnValue(true) },
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
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await DoctorController.GetDoctorByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return doctor details if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      Doctor.findByPk.mockResolvedValue(fakeDoctor);

      await DoctorController.GetDoctorByID(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: `Successfully retrieve doctor with id ${req.params.id}`,
        data: fakeDoctor,
      });
    });

    it("should return 404 if doctor is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Doctor.findByPk.mockResolvedValue(null);

      const error = new Error("Doctor requested not found");
      error.status = 404;

      await DoctorController.GetDoctorByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Doctor.findByPk.mockRejectedValue(error);

      await DoctorController.GetDoctorByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});