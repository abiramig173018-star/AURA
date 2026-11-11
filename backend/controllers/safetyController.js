
const db = require("../config/database");

// 1. Report a safety incident
exports.createIncident = (req, res) => {
    const {
        employee_id,
        incident_type,
        severity,
        description
    } = req.body;

    const validSeverities = ["low", "medium", "high", "critical"];

    if (
        !incident_type ||
        !severity ||
        !validSeverities.includes(severity.toLowerCase())
    ) {
        return res.status(400).json({
            success: false,
            message: "Incident type and valid severity are required."
        });
    }

    try {
        if (employee_id !== undefined && employee_id !== null) {
            const employee = db.prepare(
                "SELECT id FROM employees WHERE id = ?"
            ).get(employee_id);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found."
                });
            }
        }

        const result = db.prepare(`
            INSERT INTO safety_incidents
            (employee_id, incident_type, severity, description)
            VALUES (?, ?, ?, ?)
        `).run(
            employee_id || null,
            incident_type,
            severity.toLowerCase(),
            description || null
        );

        res.status(201).json({
            success: true,
            message: "Safety incident reported successfully.",
            incidentId: result.lastInsertRowid
        });

    } catch (error) {
        console.error("Create incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to report safety incident."
        });
    }
};


// 2. View all safety incidents
exports.getIncidents = (req, res) => {
    try {
        const incidents = db.prepare(`
            SELECT
                si.*,
                e.name AS employee_name,
                e.employee_code
            FROM safety_incidents si
            LEFT JOIN employees e ON si.employee_id = e.id
            ORDER BY si.id DESC
        `).all();

        res.json({
            success: true,
            count: incidents.length,
            incidents
        });

    } catch (error) {
        console.error("Fetch incidents error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch safety incidents."
        });
    }
};


// 3. Update safety incident status
exports.updateIncidentStatus = (req, res) => {
    const incidentId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
        "open",
        "in_progress",
        "resolved",
        "closed"
    ];

    if (
        typeof status !== "string" ||
        !validStatuses.includes(status.toLowerCase())
    ) {
        return res.status(400).json({
            success: false,
            message: "Status must be open, in_progress, resolved or closed."
        });
    }

    try {
        const incident = db.prepare(
            "SELECT * FROM safety_incidents WHERE id = ?"
        ).get(incidentId);

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: "Safety incident not found."
            });
        }

        db.prepare(`
            UPDATE safety_incidents
            SET status = ?
            WHERE id = ?
        `).run(status.toLowerCase(), incidentId);

        res.json({
            success: true,
            message: "Incident status updated successfully.",
            incidentId,
            status: status.toLowerCase()
        });

    } catch (error) {
        console.error("Update incident error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update incident status."
        });
    }
};
