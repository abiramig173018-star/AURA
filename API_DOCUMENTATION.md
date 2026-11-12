
# AURA Backend API Documentation

## Project Information
- Project: AURA – Intelligent Industrial AI Co-Pilot
- Backend: Node.js + Express.js
- Database: SQLite
- AI/ML: Python-based anomaly detection
- Backend URL: http://localhost:5000
- Data Mode: SIMULATED

## 1. Health Check

**GET** `/api/health`

Checks whether the backend is running.

## 2. Employees

**GET** `/api/employees`

Fetches employee records.

## 3. Attendance

**GET** `/api/attendance`

Fetches attendance records.

## 4. Machines

**GET** `/api/machines`

Fetches all registered machines.

## 5. Machine Readings

**GET** `/api/machines/1/readings?limit=10`

Fetches the latest 10 readings for machine ID 1.

Optional query parameter:
- `limit`: Number of readings (default 100, maximum 500).

## 6. Add Machine Reading

**POST** `/api/machines/1/readings`

Request body:
```json
{
  "temperature": 65.5,
  "vibration": 2.5
}
```

Runs threshold analysis and ML anomaly detection.

## 7. Machine Analysis

**GET** `/api/machines/1/analysis`

Returns the latest machine analysis and health information.

## 8. Machine Alerts

**GET** `/api/machines/1/alerts`

Fetches alerts for machine ID 1.

## 9. Machine Overview

**GET** `/api/machines/1/overview`

Returns machine health, latest reading, ML prediction and alert information.

## 10. Production Records

**GET** `/api/production/1`

Fetches production records for machine ID 1.

## 11. Production Summary

**GET** `/api/production/1/summary`

Returns total units, defects, good units and defect rate.

## 12. Safety Incidents

**GET** `/api/safety`

Fetches safety incident records.

## 13. Dashboard Overview

**GET** `/api/dashboard/overview`

Returns combined dashboard information:
- Employee statistics
- Attendance statistics
- Machine statistics
- Production statistics
- Safety incident statistics
- Machine alerts

## Important Notes

1. Replace `localhost` with the backend server IP when connecting from another computer.
2. Machine ID 1 is the current demo machine.
3. Sensor readings are simulated, not collected from physical hardware.
4. Python ML provides anomaly detection; it is not a validated machine-failure probability.
5. No authentication is currently implemented.

## Frontend Integration

Base URL:
`http://localhost:5000/api`

Use GET requests to retrieve information and POST requests to submit machine readings.

For POST requests, use:
`Content-Type: application/json`
