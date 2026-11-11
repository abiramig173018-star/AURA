
import joblib
import pandas as pd
import json
import sys

from pathlib import Path

BASE_DIR = Path(__file__).parent
MODEL_FILE = BASE_DIR / "models" / "isolation_forest.joblib"

model = joblib.load(MODEL_FILE)

def predict_machine(temperature, vibration):
    readings = pd.DataFrame([{
        "temperature": temperature,
        "vibration": vibration
    }])

    prediction = model.predict(readings)[0]
    score = model.decision_function(readings)[0]

    is_anomaly = prediction == -1

    return {
        "status": "ANOMALY" if is_anomaly else "NORMAL",
        "anomaly": bool(is_anomaly),
        "anomaly_score": round(float(score), 4),
        "temperature": temperature,
        "vibration": vibration
    }

if __name__ == "__main__":
    try:
        temperature = float(sys.argv[1])
        vibration = float(sys.argv[2])

        result = predict_machine(temperature, vibration)
        print(json.dumps(result))

    except Exception as error:
        print(json.dumps({
            "error": str(error)
        }))
        sys.exit(1)
