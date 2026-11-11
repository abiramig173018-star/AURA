
const express = require("express");
const router = express.Router();

const machineController = require("../controllers/machineController");

// Register and view machines
router.post("/", machineController.createMachine);
router.get("/", machineController.getMachines);

// Machine sensor readings
router.post("/:id/readings", machineController.addReading);
router.get("/:id/readings", machineController.getMachineReadings);

// Machine intelligence and health
router.get("/:id/analysis", machineController.analyzeMachineStatus);
router.get("/:id/overview", machineController.getMachineOverview);

// Machine alerts
router.get("/:id/alerts", machineController.getMachineAlerts);

module.exports = router;
