const TimeslotController = require("../src/controllers/timeslotController");
const { Timeslot, Schedule, Doctor } = require("../src/models");
const { Op } = require("sequelize");

jest.mock("../src/models", () => ({
  Timeslot: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
  Schedule: {
    findAll: jest.fn(),
  },
  Doctor: {
    findByPk: jest.fn(),
  },
}));

const mockNext = jest.fn();

describe("TimeslotController", () => {
  describe("GetTimeslotByDoctorId", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await TimeslotController.GetTimeslotByDoctorId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
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

      await TimeslotController.GetTimeslotByDoctorId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return timeslots for the doctor if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      const fakeTimeslots = [
        {
          id: 1,
          slotTersedia: 5,
          tanggal: new Date(),
          Schedule: { hari: "Monday", waktu: "10:00 AM" },
        },
      ];

      Doctor.findByPk.mockResolvedValue(fakeDoctor);
      Timeslot.findAll.mockResolvedValue(fakeTimeslots);

      await TimeslotController.GetTimeslotByDoctorId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully retrieve schedule for requested doctor",
        data: fakeTimeslots.map(x => ({
          id: x.id,
          kuota: x.slotTersedia,
          tanggal: x.tanggal,
          hari: x.Schedule.hari,
          waktu: x.Schedule.waktu,
        })),
      });
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

      await TimeslotController.GetTimeslotByDoctorId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("GenerateTimeslot", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        body: { DoctorId: 1, month: 5, year: 2024 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await TimeslotController.GenerateTimeslot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 404 if doctor is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, month: 5, year: 2024 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Doctor.findByPk.mockResolvedValue(null);

      const error = new Error("Doctor requested not found");
      error.status = 404;

      await TimeslotController.GenerateTimeslot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 409 if timeslots for the month already exist", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, month: 5, year: 2024 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      const fakeTimeslots = [
        { id: 1, tanggal: new Date(), slotTersedia: 5, Schedule: {} },
      ];

      Doctor.findByPk.mockResolvedValue(fakeDoctor);
      Timeslot.findAll.mockResolvedValue(fakeTimeslots);

      const error = new Error("Timeslot for this month already generated");
      error.status = 409;

      await TimeslotController.GenerateTimeslot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should create timeslots if doctor is found and no existing timeslots for the month", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, month: 5, year: 2024 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      const fakeSchedules = [
        { id: 1, DoctorId: 1, kuota: 5, hari: "senin", waktu: "10:00 AM" },
      ];

      Doctor.findByPk.mockResolvedValue(fakeDoctor);
      Timeslot.findAll.mockResolvedValue([]);
      Schedule.findAll.mockResolvedValue(fakeSchedules);

      Timeslot.create.mockResolvedValue({});

      await TimeslotController.GenerateTimeslot(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully generate timeslots",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, month: 5, year: 2024 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Timeslot.create.mockRejectedValue(error);

      await TimeslotController.GenerateTimeslot(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});