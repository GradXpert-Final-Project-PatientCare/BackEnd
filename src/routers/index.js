const router = require("express").Router();
const userRouter = require("./userRouter");
const doctorRouter = require("./doctorRouter");
const appointmentRouter = require("./appointmentRouter");
const scheduleRouter = require("./scheduleRouter");
const timeslotRouter = require("./timeslotRouter");
const errorHandler = require("../middlewares/error");
const notFound = require("../middlewares/notFound");

// Test
router.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
router.use("/user", userRouter);
router.use("/doctor", doctorRouter);
router.use("/appointment", appointmentRouter);
router.use("/schedule", scheduleRouter);
router.use("/timeslot", timeslotRouter);

// Error handler
router.use(notFound);
router.use(errorHandler);

module.exports = router;
