
const { execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");

const execFileAsync = promisify(execFile);

function analyzeMachine(temperature, vibration) {
    const alerts = [];

    if (temperature >= 80) {
        alerts.push({
            type: "HIGH_TEMPERATURE",
            message: "Machine temperature is above the configured limit."
        });
    }

    if (vibration >= 5) {
        alerts.push({
            type: "HIGH_VIBRATION",
            message: "Machine vibration is above the configured limit."
        });
    }

    let status = "NORMAL";

    if (alerts.length === 1) {
        status = "WARNING";
    } else if (alerts.length > 1) {
        status = "CRITICAL";
    }

    return {
        status,
        temperature,
        vibration,
        alerts,
        recommendation: alerts.length
            ? "Inspect the machine and verify the sensor readings."
            : "No abnormal readings detected using the current thresholds."
    };
}

async function predictWithML(temperature, vibration) {
    const backendPath = path.resolve(__dirname, "..");

    const { stdout } = await execFileAsync(
        "py",
        [
            "ml/predict.py",
            String(temperature),
            String(vibration)
        ],
        {
            cwd: backendPath,
            timeout: 10000,
            windowsHide: true
        }
    );

    const result = JSON.parse(stdout.trim());

    if (result.error) {
        throw new Error(result.error);
    }

    return result;
}
function calculateMachineHealth(temperature, vibration) {
    const temperaturePenalty = Math.min(
        50,
        Math.max(0, ((temperature - 60) / 40) * 50)
    );

    const vibrationPenalty = Math.min(
        50,
        Math.max(0, ((vibration - 2) / 6) * 50)
    );

    const healthScore = Math.max(
        0,
        Math.min(
            100,
            Math.round(100 - temperaturePenalty - vibrationPenalty)
        )
    );

    let healthLabel = "EXCELLENT";

    if (healthScore < 40) {
        healthLabel = "CRITICAL";
    } else if (healthScore < 70) {
        healthLabel = "POOR";
    } else if (healthScore < 90) {
        healthLabel = "GOOD";
    }

    return {
        healthScore,
        healthLabel
    };
}
module.exports = {
    analyzeMachine,
    predictWithML,
    calculateMachineHealth
};
