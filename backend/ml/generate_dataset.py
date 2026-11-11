
import numpy as np
import pandas as pd
from pathlib import Path

np.random.seed(42)

number_of_records = 1000

temperature = np.random.normal(60, 7, number_of_records)
vibration = np.random.normal(2.0, 0.6, number_of_records)

temperature = np.clip(temperature, 40, 78)
vibration = np.clip(vibration, 0.3, 4.5)

data = pd.DataFrame({
    "temperature": temperature,
    "vibration": vibration
})

output_folder = Path(__file__).parent / "data"
output_folder.mkdir(parents=True, exist_ok=True)

output_file = output_folder / "machine_sensor_data.csv"
data.to_csv(output_file, index=False)

print("AURA sensor dataset generated successfully!")
print("Total records:", len(data))
print("Saved at:", output_file)
print("\nDataset preview:")
print(data.head())
