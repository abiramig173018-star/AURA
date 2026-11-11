
const db = require("../config/database");

// 1. Add a production record
exports.createProductionRecord = (req, res) => {
    const { units_produced, defect_count } = req.body;
    const machineId = req.params.machineId;

    if (
        !Number.isInteger(units_produced) ||
        units_produced <= 0 ||
        !Number.isInteger(defect_count) ||
        defect_count < 0 ||
        defect_count > units_produced
    ) {
        return res.status(400).json({
            success: false,
            message: "Enter valid production and defect counts."
        });
    }

    try {
        const machine = db.prepare(
            "SELECT * FROM machines WHERE id = ?"
        ).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const result = db.prepare(`
            INSERT INTO production_records
            (machine_id, units_produced, defect_count)
            VALUES (?, ?, ?)
        `).run(machineId, units_produced, defect_count);

        res.status(201).json({
            success: true,
            message: "Production record added successfully.",
            recordId: result.lastInsertRowid,
            machine: machine.machine_name,
            units_produced,
            defect_count
        });

    } catch (error) {
        console.error("Production record error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add production record."
        });
    }
};


// 2. View production records
exports.getProductionRecords = (req, res) => {
    const machineId = req.params.machineId;

    try {
        const machine = db.prepare(
            "SELECT * FROM machines WHERE id = ?"
        ).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const records = db.prepare(`
            SELECT * FROM production_records
            WHERE machine_id = ?
            ORDER BY id DESC
        `).all(machineId);

        res.json({
            success: true,
            machine: machine.machine_name,
            count: records.length,
            records
        });

    } catch (error) {
        console.error("Fetch production records error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch production records."
        });
    }
};


// 3. Production summary
exports.getProductionSummary = (req, res) => {
    const machineId = req.params.machineId;

    try {
        const machine = db.prepare(
            "SELECT * FROM machines WHERE id = ?"
        ).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const summary = db.prepare(`
            SELECT
                COALESCE(SUM(units_produced), 0) AS totalProduced,
                COALESCE(SUM(defect_count), 0) AS totalDefects
            FROM production_records
            WHERE machine_id = ?
        `).get(machineId);

        const defectRate = summary.totalProduced > 0
            ? Number(
                (summary.totalDefects / summary.totalProduced * 100)
                    .toFixed(2)
            )
            : 0;

        res.json({
            success: true,
            machine: machine.machine_name,
            totalProduced: summary.totalProduced,
            totalDefects: summary.totalDefects,
            goodUnits: summary.totalProduced - summary.totalDefects,
            defectRate: `${defectRate}%`
        });

    } catch (error) {
        console.error("Production summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch production summary."
        });
    }
};
