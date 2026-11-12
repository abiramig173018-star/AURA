
const MACHINE_ID = 1;
const API_URL = `http://localhost:5000/api/machines/${MACHINE_ID}/readings`;

let readingCount = 0;
let isSending = false;

function generateReading() {
    readingCount++;

    // Every 6th reading simulates a machine fault
    if (readingCount % 6 === 0) {
        return {
            temperature: 95,
            vibration: 6.5
        };
    }

    // Normal operating conditions
    return {
        temperature: Number((62 + Math.random() * 8).toFixed(2)),
        vibration: Number((1.8 + Math.random() * 1.2).toFixed(2))
    };
}

async function sendReading() {
    if (isSending) return;

    isSending = true;

    const reading = generateReading();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reading)
        });

        const result = await response.json();

        console.log("\n--- AURA SENSOR SIMULATOR ---");
        console.log("Reading:", reading);
        console.log("Response:", result.message);
        console.log("Machine status:", result.analysis?.status);
        console.log("ML prediction:", result.analysis?.mlPrediction?.status);
        console.log("Alerts saved:", result.alertsSaved);

    } catch (error) {
        console.error("Simulator error:", error.message);
    } finally {
        isSending = false;
    }
}

console.log("AURA Machine Simulator Started");
console.log("Machine ID:", MACHINE_ID);
console.log("Generating simulated sensor readings every 15 seconds.");

sendReading();
const simulator = setInterval(sendReading, 15000);

process.on("SIGINT", () => {
    clearInterval(simulator);
    console.log("\nAURA Simulator stopped."); 
    process.exit(0);
});
