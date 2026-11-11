
const db = require("../config/database");

// Employee check-in
exports.checkIn = (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({
            success: false,
            message: "Employee ID is required."
        });
    }

    const employee = db.prepare(
        "SELECT * FROM employees WHERE id = ? AND status = 'active'"
    ).get(employee_id);

    if (!employee) {
        return res.status(404).json({
            success: false,
            message: "Active employee not found."
        });
    }

    const lastEvent = db.prepare(`
        SELECT event_type FROM attendance
        WHERE employee_id = ?
        ORDER BY id DESC LIMIT 1
    `).get(employee_id);

    if (lastEvent && lastEvent.event_type === "check_in") {
        return res.status(409).json({
            success: false,
            message: "Employee is already checked in."
        });
    }

    db.prepare(`
        INSERT INTO attendance (employee_id, event_type)
        VALUES (?, 'check_in')
    `).run(employee_id);

    res.status(201).json({
        success: true,
        message: `${employee.name} checked in successfully.`
    });
};

// Employee check-out
exports.checkOut = (req, res) => {
    const { employee_id } = req.body;

    if (!employee_id) {
        return res.status(400).json({
            success: false,
            message: "Employee ID is required."
        });
    }

    const employee = db.prepare(
        "SELECT * FROM employees WHERE id = ? AND status = 'active'"
    ).get(employee_id);

    if (!employee) {
        return res.status(404).json({
            success: false,
            message: "Active employee not found."
        });
    }

    const lastEvent = db.prepare(`
        SELECT event_type FROM attendance
        WHERE employee_id = ?
        ORDER BY id DESC LIMIT 1
    `).get(employee_id);

    if (!lastEvent || lastEvent.event_type !== "check_in") {
        return res.status(409).json({
            success: false,
            message: "Employee must check in before checking out."
        });
    }

    db.prepare(`
        INSERT INTO attendance (employee_id, event_type)
        VALUES (?, 'check_out')
    `).run(employee_id);

    res.status(201).json({
        success: true,
        message: `${employee.name} checked out successfully.`
    });
};

// View attendance records
exports.getAttendance = (req, res) => {
    const records = db.prepare(`
        SELECT
            attendance.id,
            employees.employee_code,
            employees.name,
            attendance.event_type,
            attendance.event_time
        FROM attendance
        JOIN employees ON attendance.employee_id = employees.id
        ORDER BY attendance.id DESC
    `).all();

    res.json({
        success: true,
        count: records.length,
        records
    });
};
