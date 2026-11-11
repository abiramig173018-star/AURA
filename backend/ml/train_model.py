import pandas as pd
import joblib

from pathlib import Path
from sklearn.ensemble import IsolationForest
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).parent
DATA_FILE = BASE_DIR / "data" / "machine_sensor_data.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_FILE = MODEL_DIR / "isolation_forest.joblib"

data = pd.read_csv(DATA_FILE)

features = ["temperature", "vibration"]
X = data[features]

model = Pipeline([
    ("scaler", StandardScaler()),
    ("detector", IsolationForest(
        n_estimators=200,
        contamination=0.03,
        random_state=42
    ))
])

model.fit(X)

MODEL_DIR.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_FILE)

print("AURA ML MODEL TRAINED SUCCESSFULLY!")
print("Training records:", len(X))
print("Model saved at:", MODEL_FILE)

test_data = pd.DataFrame([
    {"temperature": 65.5, "vibration": 2.4},
    {"temperature": 95.0, "vibration": 6.5}
])

predictions = model.predict(test_data[features])

for i, prediction in enumerate(predictions):
    status = "ANOMALY DETECTED" if prediction == -1 else "NORMAL"
    print(f"Test {i + 1}: {status}")