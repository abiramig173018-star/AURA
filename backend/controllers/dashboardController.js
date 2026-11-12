
const db = require("../config/database");

exports.getDashboardOverview = (req, res) => {
    try {
        // Employee statistics
        const employees = db.prepare(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END), 0) AS active
            FROM employees
        `).get();

        // Live attendance
        const attendance = db.prepare(`
            SELECT COUNT(*) AS presentNow
            FROM (
                SELECT
                    employee_id,
                    event_type,
                    ROW_NUMBER() OVER (
                        PARTITION BY employee_id
                        ORDER BY event_time DESC, id DESC
                    ) AS rn
                FROM attendance
            )
            WHERE rn = 1 AND event_type = 'check_in'
        `).get();

        // Machine statistics
        const machines = db.prepare(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN status = 'operational' THEN 1 ELSE 0 END), 0) AS operational
            FROM machines
        `).get();

        // Today's production statistics
        const production = db.prepare(`
            SELECT
                COALESCE(SUM(units_produced), 0) AS unitsProduced,
                COALESCE(SUM(defect_count), 0) AS defects
            FROM production_records
            WHERE DATE(recorded_at) = DATE('now', 'localtime')
        `).get();

        // Safety incident statistics
        const safety = db.prepare(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END), 0) AS open
            FROM safety_incidents
        `).get();

        // Machine alert lifecycle statistics
        const alerts = db.prepare(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END), 0) AS open,
                COALESCE(SUM(CASE WHEN status = 'ACKNOWLEDGED' THEN 1 ELSE 0 END), 0) AS acknowledged,
                COALESCE(SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END), 0) AS resolved
            FROM machine_alerts
        `).get();

        // Latest five machine alerts
        const latestAlerts = db.prepare(`
            SELECT
                id,
                machine_id,
                alert_type,
                severity,
                message,
                status,
                acknowledged_at,
                resolved_at,
                created_at
            FROM machine_alerts
            ORDER BY created_at DESC, id DESC
            LIMIT 5
        `).all();

        // Dashboard response
        res.json({
            success: true,
            dataMode: "SIMULATED",
            generatedAt: new Date().toISOString(),
            employees,
            attendance,
            machines,
            production,
            safety,
            alerts,
            latestAlerts
        });

    } catch (error) {
        console.error("Dashboard overview error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dashboard overview."
        });
    }
};
