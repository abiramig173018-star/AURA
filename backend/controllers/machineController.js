
const db = require("../config/database");

const {
    analyzeMachine,
    predictWithML,
    calculateMachineHealth
} = require("../services/machineIntelligence");

// Combine threshold analysis and ML prediction
function combineAnalysis(thresholdAnalysis, mlPrediction) {
    let status = thresholdAnalysis.status;

    if (status !== "CRITICAL" && mlPrediction.anomaly) {
        status = "WARNING";
    }

    return {
        ...thresholdAnalysis,
        status,
        mlPrediction
    };
}

// 1. Register a machine
exports.createMachine = (req, res) => {
    const { machine_code, machine_name, location } = req.body;

    if (!machine_code || !machine_name) {
        return res.status(400).json({
            success: false,
            message: "Machine code and machine name are required."
        });
    }

    try {
        const result = db.prepare(`
            INSERT INTO machines (machine_code, machine_name, location)
            VALUES (?, ?, ?)
        `).run(machine_code, machine_name, location || null);

        res.status(201).json({
            success: true,
            message: "Machine registered successfully.",
            machineId: result.lastInsertRowid
        });
    } catch (error) {
        console.error("Create machine error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register machine."
        });
    }
};

// 2. Get all machines
exports.getMachines = (req, res) => {
    try {
        const machines = db.prepare(`
            SELECT * FROM machines ORDER BY id DESC
        `).all();

        res.json({
            success: true,
            count: machines.length,
            machines
        });
    } catch (error) {
        console.error("Get machines error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch machines."
        });
    }
};

// 3. Add sensor reading and perform ML analysis
exports.addReading = async (req, res) => {
    const machineId = req.params.id;
    const { temperature, vibration } = req.body;

    if (
        temperature === undefined ||
        vibration === undefined ||
        !Number.isFinite(Number(temperature)) ||
        !Number.isFinite(Number(vibration))
    ) {
        return res.status(400).json({
            success: false,
            message: "Valid temperature and vibration values are required."
        });
    }

    try {
        const machine = db.prepare(`
            SELECT * FROM machines WHERE id = ?
        `).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const temp = Number(temperature);
        const vib = Number(vibration);

        const result = db.prepare(`
            INSERT INTO machine_readings
            (machine_id, temperature, vibration)
            VALUES (?, ?, ?)
        `).run(machineId, temp, vib);

        const readingId = result.lastInsertRowid;

        const thresholdAnalysis = analyzeMachine(temp, vib);
        const mlPrediction = await predictWithML(temp, vib);

        const analysis = combineAnalysis(
            thresholdAnalysis,
            mlPrediction
        );

        const machineHealth = calculateMachineHealth(temp, vib);

        let alertsSaved = 0;

        const insertAlert = db.prepare(`
            INSERT INTO machine_alerts
            (machine_id, reading_id, alert_type, severity, message)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const alert of thresholdAnalysis.alerts) {
            insertAlert.run(
                machineId,
                readingId,
                alert.type,
                thresholdAnalysis.status.toUpperCase(),
                alert.message
            );
            alertsSaved++;
        }

        if (mlPrediction.anomaly && thresholdAnalysis.alerts.length === 0) {
            insertAlert.run(
                machineId,
                readingId,
                "ML_ANOMALY",
                "WARNING",
                "Machine anomaly detected by the ML model."
            );
            alertsSaved++;
        }

        res.status(201).json({
            success: true,
            message: "Machine reading recorded and ML analysis completed.",
            readingId,
            machine: machine.machine_name,
            analysis,
            machineHealth,
            alertsSaved
        });

    } catch (error) {
        console.error("Add reading error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to record machine reading."
        });
    }
};

// 4. Get machine readings with optional limit
exports.getMachineReadings = (req, res) => {
    const machineId = Number(req.params.id);

    try {
        const machine = db.prepare(`
            SELECT * FROM machines WHERE id = ?
        `).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const requestedLimit = Number(req.query.limit) || 100;
        const limit = Math.min(Math.max(requestedLimit, 1), 500);

        const readings = db.prepare(`
            SELECT *
            FROM machine_readings
            WHERE machine_id = ?
            ORDER BY id DESC
            LIMIT ?
        `).all(machineId, limit);

        res.json({
            success: true,
            machine: machine.machine_name,
            machineId,
            count: readings.length,
            limit,
            readings
        });

    } catch (error) {
        console.error("Get readings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch machine readings."
        });
    }
};

// 5. Analyze machine status
exports.analyzeMachineStatus = async (req, res) => {
    const machineId = req.params.id;

    try {
        const machine = db.prepare(`
            SELECT * FROM machines WHERE id = ?
        `).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const reading = db.prepare(`
            SELECT * FROM machine_readings
            WHERE machine_id = ?
            ORDER BY id DESC
            LIMIT 1
        `).get(machineId);

        if (!reading) {
            return res.json({
                success: true,
                message: "No sensor readings available.",
                status: "NO_DATA"
            });
        }

        const thresholdAnalysis = analyzeMachine(
            reading.temperature,
            reading.vibration
        );

        const mlPrediction = await predictWithML(
            reading.temperature,
            reading.vibration
        );

        const analysis = combineAnalysis(
            thresholdAnalysis,
            mlPrediction
        );

        const machineHealth = calculateMachineHealth(
            reading.temperature,
            reading.vibration
        );

        res.json({
            success: true,
            machine: machine.machine_name,
            analysis,
            machineHealth
        });

    } catch (error) {
        console.error("Machine analysis error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to analyze machine."
        });
    }
};

// 6. Get machine alerts
exports.getMachineAlerts = (req, res) => {
    const machineId = req.params.id;

    try {
        const machine = db.prepare(`
            SELECT * FROM machines WHERE id = ?
        `).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const alerts = db.prepare(`
            SELECT * FROM machine_alerts
            WHERE machine_id = ?
            ORDER BY id DESC
        `).all(machineId);

        res.json({
            success: true,
            machine: machine.machine_name,
            count: alerts.length,
            alerts
        });

    } catch (error) {
        console.error("Get machine alerts error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch machine alerts."
        });
    }
};

// 7. Get complete machine overview
exports.getMachineOverview = async (req, res) => {
    const machineId = req.params.id;

    try {
        const machine = db.prepare(`
            SELECT * FROM machines WHERE id = ?
        `).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const latestReading = db.prepare(`
            SELECT * FROM machine_readings
            WHERE machine_id = ?
            ORDER BY id DESC
            LIMIT 1
        `).get(machineId);

        let analysis = null;
        let machineHealth = null;

        if (latestReading) {
            const thresholdAnalysis = analyzeMachine(
                latestReading.temperature,
                latestReading.vibration
            );

            const mlPrediction = await predictWithML(
                latestReading.temperature,
                latestReading.vibration
            );

            analysis = combineAnalysis(
                thresholdAnalysis,
                mlPrediction
            );

            machineHealth = calculateMachineHealth(
                latestReading.temperature,
                latestReading.vibration
            );
        }

        const alertCount = db.prepare(`
            SELECT COUNT(*) AS total
            FROM machine_alerts
            WHERE machine_id = ?
        `).get(machineId);

        const recentAlerts = db.prepare(`
            SELECT * FROM machine_alerts
            WHERE machine_id = ?
            ORDER BY id DESC
            LIMIT 5
        `).all(machineId);

        res.json({
            success: true,
            overview: {
                machine,
                healthStatus: analysis ? analysis.status : "NO_DATA",
                machineHealth,
                latestReading: latestReading || null,
                analysis,
                totalAlerts: alertCount.total,
                recentAlerts
            }
        });

    } catch (error) {
        console.error("Machine overview error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch machine overview."
        });
    }
};

// Get alerts by status
exports.getAlertsByStatus = (req, res) => {
    try {
        const machineId = Number(req.params.id);
        const status = String(req.query.status || "OPEN").toUpperCase();

        if (!Number.isInteger(machineId) || machineId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid machine ID."
            });
        }

        if (!["OPEN", "ACKNOWLEDGED", "RESOLVED"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid alert status."
            });
        }

        const machine = db.prepare(
            "SELECT id FROM machines WHERE id = ?"
        ).get(machineId);

        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Machine not found."
            });
        }

        const alerts = db.prepare(`
            SELECT * FROM machine_alerts
            WHERE machine_id = ? AND status = ?
            ORDER BY created_at DESC
        `).all(machineId, status);

        res.json({
            success: true,
            count: alerts.length,
            status,
            alerts
        });

    } catch (error) {
        console.error("Get alerts by status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts."
        });
    }
};

// Acknowledge an alert
exports.acknowledgeAlert = (req, res) => {
    try {
        const machineId = Number(req.params.id);
        const alertId = Number(req.params.alertId);

        const alert = db.prepare(`
            SELECT * FROM machine_alerts
            WHERE id = ? AND machine_id = ?
        `).get(alertId, machineId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found."
            });
        }

        if (alert.status !== "OPEN") {
            return res.status(400).json({
                success: false,
                message: `Cannot acknowledge an alert with status ${alert.status}.`
            });
        }

        db.prepare(`
            UPDATE machine_alerts
            SET status = 'ACKNOWLEDGED',
                acknowledged_at = CURRENT_TIMESTAMP
            WHERE id = ? AND machine_id = ? AND status = 'OPEN'
        `).run(alertId, machineId);

        res.json({
            success: true,
            message: "Alert acknowledged successfully."
        });

    } catch (error) {
        console.error("Acknowledge alert error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to acknowledge alert."
        });
    }
};

// Resolve an alert
exports.resolveAlert = (req, res) => {
    try {
        const machineId = Number(req.params.id);
        const alertId = Number(req.params.alertId);

        const alert = db.prepare(`
            SELECT * FROM machine_alerts
            WHERE id = ? AND machine_id = ?
        `).get(alertId, machineId);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found."
            });
        }

        if (alert.status === "RESOLVED") {
            return res.status(400).json({
                success: false,
                message: "Alert is already resolved."
            });
        }

        db.prepare(`
            UPDATE machine_alerts
            SET status = 'RESOLVED',
                resolved_at = CURRENT_TIMESTAMP
            WHERE id = ? AND machine_id = ?
        `).run(alertId, machineId);

        res.json({
            success: true,
            message: "Alert resolved successfully."
        });

    } catch (error) {
        console.error("Resolve alert error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to resolve alert."
        });
    }
};
