
const express = require("express");
const router = express.Router();

const safetyController = require("../controllers/safetyController");

// Report a safety incident
router.post("/", safetyController.createIncident);

// View all safety incidents
router.get("/", safetyController.getIncidents);

// Update incident status
router.put("/:id/status", safetyController.updateIncidentStatus);

module.exports = router;
