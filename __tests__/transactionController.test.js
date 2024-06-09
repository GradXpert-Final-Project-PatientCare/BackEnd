const { Timeslot, Doctor, User, Transaction, Appointment, sequelize } = require("../src/models");
const midtransClient = require("midtrans-client");
const TransactionController = require("../src/controllers/transactionController");

jest.mock("../src/models", () => ({
  Timeslot: {
    findOne: jest.fn(),
    save: jest.fn(),
  },
  Doctor: jest.fn(),
  User: jest.fn(),
  Transaction: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  Appointment: {
    create: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

jest.mock("midtrans-client");

describe("TransactionController", () => {
  describe("CreateTransaction", () => {
    it("should return 403 if user is not authorized to create transaction", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(false) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const error = new Error("Forbidden resource");
      error.status = 403;

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should return existing pending transaction token if found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const existingTransaction = { token: "existing_token" };

      Transaction.findOne.mockResolvedValue(existingTransaction);

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully create transaction",
        data: "existing_token",
      });
    });

    it("should return 404 if timeslot is not found", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      Transaction.findOne.mockResolvedValue(null);
      Timeslot.findOne.mockResolvedValue(null);

      const error = new Error("Timeslot requested not found");
      error.status = 404;

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should return 409 if timeslot quota is full", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const fakeTimeslot = { id: 1, slotTersedia: 0 };

      Transaction.findOne.mockResolvedValue(null);
      Timeslot.findOne.mockResolvedValue(fakeTimeslot);

      const error = new Error("Timeslot quota already full");
      error.status = 409;

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should create a new transaction successfully", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const fakeTimeslot = {
        id: 1,
        slotTersedia: 1,
        Schedule: {
          Doctor: { id: 1 },
        },
        save: jest.fn(),
        set: jest.fn(),
      };

      const transaction = {
        id: 1,
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      Transaction.findOne.mockResolvedValue(null);
      Timeslot.findOne.mockResolvedValue(fakeTimeslot);
      sequelize.transaction.mockResolvedValue(transaction);
      Transaction.create.mockResolvedValue({ id: 1 });

      const snap = {
        createTransaction: jest.fn().mockResolvedValue({ token: "new_token" }),
      };
      midtransClient.Snap.mockImplementation(() => snap);

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Successfully create transaction",
        data: "new_token",
      });
    });

    it("should handle transaction failures and rollback", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const fakeTimeslot = {
        id: 1,
        slotTersedia: 1,
        Schedule: {
          Doctor: { id: 1 },
        },
        save: jest.fn(),
      };

      const transaction = {
        id: 1,
        commit: jest.fn(),
        rollback: jest.fn(),
      };

      sequelize.transaction.mockResolvedValue(transaction);
      Timeslot.findOne.mockResolvedValue(fakeTimeslot);
      Transaction.create.mockRejectedValue(new Error("Database error"));

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(transaction.rollback).toHaveBeenCalled();
      const error = new Error("Transaction Failed");
      error.status = 422;
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        ability: { can: jest.fn().mockReturnValue(true) },
        body: { TimeslotId: 1, keterangan: "test" },
        user: { id: 1 },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      const error = new Error("Database error");
      Timeslot.findOne.mockRejectedValue(error);

      await TransactionController.CreateTransaction(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("MidtransWebhook", () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {},
      };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    it("should handle webhook notification for successful transaction", async () => {
      req.body = {
        order_id: 1,
        transaction_status: "settlement",
        fraud_status: "accept",
      };

      const fakeTransaction = {
        id: 1,
        UserId: 1,
        DoctorId: 1,
        TimeslotId: 1,
        keterangan: "test",
        save: jest.fn(),
      };
      const mockNext = jest.fn();

      Transaction.findOne.mockResolvedValue(fakeTransaction);

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(Appointment.create).toHaveBeenCalledWith({
        UserId: 1,
        DoctorId: 1,
        TimeslotId: 1,
        status: "dipesan",
        keterangan: "test",
      });
      expect(fakeTransaction.status).toBe("success");
      expect(fakeTransaction.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Payment Success" });
    });

    it("should handle webhook notification for failed transaction", async () => {
      req.body = {
        order_id: 1,
        transaction_status: "cancel",
        fraud_status: "deny",
      };

      const fakeTransaction = {
        id: 1,
        TimeslotId: 1,
        save: jest.fn(),
      };
      const fakeTimeslot = {
        id: 1,
        slotTersedia: 1,
        set: jest.fn(),
        save: jest.fn(),
      };
      const mockNext = jest.fn();

      Transaction.findOne.mockResolvedValue(fakeTransaction);
      Timeslot.findOne.mockResolvedValue(fakeTimeslot);

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Payment Failed" });
    });

    it("should handle webhook notification for invalid order ID", async () => {
      req.body = {
        order_id: null,
        transaction_status: "settlement",
        fraud_status: "accept",
      };
      const mockNext = jest.fn();

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Order Id invalid" });
    });

    it("should handle webhook notification for not found transaction", async () => {
      req.body = {
        order_id: 1,
        transaction_status: "settlement",
        fraud_status: "accept",
      };
      const mockNext = jest.fn();

      Transaction.findOne.mockResolvedValue(null);

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Transaction requested not found" });
    });

    it("should handle unknown transaction statuses", async () => {
      req.body = {
        order_id: 1,
        transaction_status: "pending",
        fraud_status: "accept",
      };

      const fakeTransaction = {
        id: 1,
        save: jest.fn(),
      };
      const mockNext = jest.fn();

      Transaction.findOne.mockResolvedValue(fakeTransaction);

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "do nothing" });
    });

    it("should return 500 if an error occurs", async () => {
      req.body = {
        order_id: 1,
        transaction_status: "settlement",
        fraud_status: "accept",
      };
      const mockNext = jest.fn();

      const error = new Error("Database error");
      Transaction.findOne.mockRejectedValue(error);

      await TransactionController.MidtransWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});