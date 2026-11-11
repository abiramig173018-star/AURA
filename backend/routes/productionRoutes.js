
const express = require("express");
const router = express.Router();

const productionController = require("../controllers/productionController");

// Add a production record
router.post(
    "/:machineId",
    productionController.createProductionRecord
);

// View production records
router.get(
    "/:machineId",
    productionController.getProductionRecords
);

// View production summary
router.get(
    "/:machineId/summary",
    productionController.getProductionSummary
);

module.exports = router;
