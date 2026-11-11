
const db = require("../config/database");

// CREATE employee
exports.createEmployee = (req, res) => {
    const {
        employee_code,
        name,
        department,
        designation,
        rfid_uid
    } = req.body;

    if (!employee_code || !name) {
        return res.status(400).json({
            success: false,
            message: "Employee code and name are required."
        });
    }

    try {
        const result = db.prepare(`
            INSERT INTO employees
            (employee_code, name, department, designation, rfid_uid)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            employee_code,
            name,
            department || null,
            designation || null,
            rfid_uid || null
        );

        res.status(201).json({
            success: true,
            message: "Employee registered successfully.",
            employeeId: result.lastInsertRowid
        });
    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                success: false,
                message: "Employee code or RFID UID already exists."
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to register employee."
        });
    }
};

// GET all employees
exports.getEmployees = (req, res) => {
    try {
        const employees = db.prepare(`
            SELECT * FROM employees ORDER BY id DESC
        `).all();

        res.json({
            success: true,
            count: employees.length,
            employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch employees."
        });
    }
};

// GET one employee
exports.getEmployeeById = (req, res) => {
    const employee = db.prepare(
        "SELECT * FROM employees WHERE id = ?"
    ).get(req.params.id);

    if (!employee) {
        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });
    }

    res.json({ success: true, employee });
};

// UPDATE employee
exports.updateEmployee = (req, res) => {
    const allowedFields = [
        "employee_code",
        "name",
        "department",
        "designation",
        "rfid_uid",
        "status"
    ];

    const updates = Object.entries(req.body).filter(
        ([key, value]) => allowedFields.includes(key) && value !== undefined
    );

    if (updates.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Provide at least one valid field to update."
        });
    }

    try {
        const setClause = updates.map(([key]) => `${key} = ?`).join(", ");
        const values = updates.map(([, value]) => value);

        const result = db.prepare(
            `UPDATE employees SET ${setClause} WHERE id = ?`
        ).run(...values, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found."
            });
        }

        res.json({
            success: true,
            message: "Employee updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update employee. Check for duplicate employee code or RFID."
        });
    }
};

// DEACTIVATE employee instead of permanently deleting
exports.deactivateEmployee = (req, res) => {
    const result = db.prepare(`
        UPDATE employees SET status = 'inactive' WHERE id = ?
    `).run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Employee not found."
        });
    }

    res.json({
        success: true,
        message: "Employee deactivated successfully."
    });
};
