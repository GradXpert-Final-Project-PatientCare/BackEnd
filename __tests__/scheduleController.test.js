const ScheduleController = require("../src/controllers/scheduleController");
const { Schedule, Doctor } = require("../src/models");

jest.mock("../src/models", () => ({
  Schedule: {
    findAll: jest.fn(),
    create: jest.fn(),
  },
  Doctor: {
    findByPk: jest.fn(),
  },
}));

const mockNext = jest.fn();

describe("ScheduleController", () => {
  describe("GetScheduleByDoctorId", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await ScheduleController.GetScheduleByDoctorId(req, res, next);

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

      await ScheduleController.GetScheduleByDoctorId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return schedules for the doctor if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      const fakeSchedules = [
        { id: 1, DoctorId: 1, kuota: 10, hari: "Monday", waktu: "10:00 AM" },
      ];
      Doctor.findByPk.mockResolvedValue(fakeDoctor);
      Schedule.findAll.mockResolvedValue(fakeSchedules);

      await ScheduleController.GetScheduleByDoctorId(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully retrieve schedule for requested doctor",
        data: fakeSchedules,
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

      await ScheduleController.GetScheduleByDoctorId(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("CreateSchedule", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        body: { DoctorId: 1, kuota: 10, hari: "Monday", waktu: "10:00 AM" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await ScheduleController.CreateSchedule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 404 if doctor is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, kuota: 10, hari: "Monday", waktu: "10:00 AM" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Doctor.findByPk.mockResolvedValue(null);

      const error = new Error("Doctor requested not found");
      error.status = 404;

      await ScheduleController.CreateSchedule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should create a schedule if doctor is found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, kuota: 10, hari: "Monday", waktu: "10:00 AM" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeDoctor = { id: 1, name: "John Doe" };
      Doctor.findByPk.mockResolvedValue(fakeDoctor);
      Schedule.create.mockResolvedValue({});

      await ScheduleController.CreateSchedule(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully create schedule",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { DoctorId: 1, kuota: 10, hari: "Monday", waktu: "10:00 AM" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Schedule.create.mockRejectedValue(error);

      await ScheduleController.CreateSchedule(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});