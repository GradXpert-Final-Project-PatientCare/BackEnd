const AppointmentController = require("../src/controllers/appointmentController");
const {
  Timeslot,
  Doctor,
  User,
  Appointment,
  sequelize,
} = require("../src/models");
const { Op } = require("sequelize");

jest.mock("../src/models", () => ({
  Timeslot: {
    findOne: jest.fn(),
  },
  Doctor: {
    findByPk: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Appointment: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

const mockNext = jest.fn();

describe("AppointmentController", () => {
  describe("GetUserAppointment", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await AppointmentController.GetUserAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return appointments for the user if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointments = [
        {
          id: 1,
          status: "dipesan",
          keterangan: "First appointment",
          Timeslot: {
            tanggal: new Date(),
            Schedule: { hari: "Monday", waktu: "10:00 AM" },
          },
          Doctor: { nama: "Dr. Smith" },
        },
      ];

      Appointment.findAll.mockResolvedValue(fakeAppointments);

      await AppointmentController.GetUserAppointment(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully retrieve appointment list",
        data: fakeAppointments.map((x) => ({
          id: x.id,
          status: x.status,
          keterangan: x.keterangan,
          tanggal: x.Timeslot.tanggal,
          hari: x.Timeslot.Schedule.hari,
          waktu: x.Timeslot.Schedule.waktu,
          dokter: x.Doctor.nama,
        })),
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Appointment.findAll.mockRejectedValue(error);

      await AppointmentController.GetUserAppointment(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("GetUserAppointmentHistory", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await AppointmentController.GetUserAppointmentHistory(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return appointment history for the user if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointments = [
        {
          id: 1,
          status: "selesai",
          keterangan: "Completed appointment",
          Timeslot: {
            tanggal: new Date(),
            Schedule: { hari: "Monday", waktu: "10:00 AM" },
          },
          Doctor: { nama: "Dr. Smith" },
        },
      ];

      Appointment.findAll.mockResolvedValue(fakeAppointments);

      await AppointmentController.GetUserAppointmentHistory(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully retrieve appointment list",
        data: fakeAppointments.map((x) => ({
          id: x.id,
          status: x.status,
          keterangan: x.keterangan,
          tanggal: x.Timeslot.tanggal,
          hari: x.Timeslot.Schedule.hari,
          waktu: x.Timeslot.Schedule.waktu,
          dokter: x.Doctor.nama,
        })),
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Appointment.findAll.mockRejectedValue(error);

      await AppointmentController.GetUserAppointmentHistory(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("UpdateAppointmentById", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it("should return 404 if appointment is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 1, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Appointment.findOne.mockResolvedValue(null);

      const error = new Error("Appointment requested not found");
      error.status = 404;

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 404 if previous timeslot is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 1, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = { TimeslotId: 1 };
      Appointment.findOne.mockResolvedValue(fakeAppointment);

      Timeslot.findOne.mockResolvedValueOnce(null);

      const error = new Error("Previous timeslot not found");
      error.status = 404;

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 404 if new timeslot is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 2, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = { TimeslotId: 1 };
      const fakePrevTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };

      Appointment.findOne.mockResolvedValue(fakeAppointment);
      Timeslot.findOne.mockResolvedValueOnce(fakePrevTimeslot);
      Timeslot.findOne.mockResolvedValueOnce(null);

      const error = new Error("Timeslot requested not found");
      error.status = 404;

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 409 if new timeslot quota is full", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 2, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = { TimeslotId: 1 };
      const fakePrevTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const fakeNewTimeslot = {
        slotTersedia: 0,
        set: jest.fn(),
        save: jest.fn(),
      };

      Appointment.findOne.mockResolvedValue(fakeAppointment);
      Timeslot.findOne.mockResolvedValueOnce(fakePrevTimeslot);
      Timeslot.findOne.mockResolvedValueOnce(fakeNewTimeslot);

      const error = new Error("Timeslot quota already full");
      error.status = 409;

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should update appointment if timeslots are found and quota is available", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 2, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = {
        TimeslotId: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const fakePrevTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const fakeNewTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };

      const t = { commit: jest.fn(), rollback: jest.fn() };
      sequelize.transaction.mockResolvedValue(t);

      Appointment.findOne.mockResolvedValue(fakeAppointment);
      Timeslot.findOne.mockResolvedValueOnce(fakePrevTimeslot);
      Timeslot.findOne.mockResolvedValueOnce(fakeNewTimeslot);

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(fakePrevTimeslot.set).toHaveBeenCalledWith({ slotTersedia: 2 });
      expect(fakeNewTimeslot.set).toHaveBeenCalledWith({ slotTersedia: 0 });
      expect(fakePrevTimeslot.save).toHaveBeenCalledWith({ transaction: t });
      expect(fakeNewTimeslot.save).toHaveBeenCalledWith({ transaction: t });
      expect(fakeAppointment.save).toHaveBeenCalledWith({ transaction: t });
      expect(t.commit).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully update appointment",
      });
    });

    it("should return 422 if transaction fails", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 2, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = {
        TimeslotId: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const fakePrevTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const fakeNewTimeslot = {
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };

      const t = { commit: jest.fn(), rollback: jest.fn() };
      sequelize.transaction.mockResolvedValue(t);

      Appointment.findOne.mockResolvedValue(fakeAppointment);
      Timeslot.findOne.mockResolvedValueOnce(fakePrevTimeslot);
      Timeslot.findOne.mockResolvedValueOnce(fakeNewTimeslot);

      fakeAppointment.save.mockRejectedValue(new Error("Database error"));

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(t.rollback).toHaveBeenCalled();
      const error = new Error("Transaction Failed");
      error.status = 422;
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
        body: { TimeslotId: 2, keterangan: "Updated appointment" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Database error");
      Appointment.findOne.mockRejectedValue(error);

      await AppointmentController.UpdateAppointmentById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("CancelAppointmentByID", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await AppointmentController.CancelAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it("should return 404 if appointment is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Appointment.findOne.mockResolvedValue(null);

      const error = new Error("Appointment requested not found");
      error.status = 404;

      await AppointmentController.CancelAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should cancel appointment if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = { id: 1, status: "dipesan", save: jest.fn() };

      Appointment.findOne.mockResolvedValue(fakeAppointment);

      await AppointmentController.CancelAppointmentByID(req, res, next);

      expect(fakeAppointment.status).toBe("dibatalkan");
      expect(fakeAppointment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully cancel appointment",
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
      Appointment.findOne.mockRejectedValue(error);

      await AppointmentController.CancelAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("CompleteAppointmentByID", () => {
    it("should return 403 if permission is not authorized", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const error = new Error("Forbidden resource");
      error.status = 403;

      await AppointmentController.CompleteAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
    it("should return 404 if appointment is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      Appointment.findOne.mockResolvedValue(null);

      const error = new Error("Appointment requested not found");
      error.status = 404;

      await AppointmentController.CompleteAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it("should complete appointment if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        params: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = mockNext;

      const fakeAppointment = { id: 1, status: "dipesan", save: jest.fn() };

      Appointment.findOne.mockResolvedValue(fakeAppointment);

      await AppointmentController.CompleteAppointmentByID(req, res, next);

      expect(fakeAppointment.status).toBe("selesai");
      expect(fakeAppointment.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully complete appointment",
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
      Appointment.findOne.mockRejectedValue(error);

      await AppointmentController.CompleteAppointmentByID(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
