import pandas as pd

url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
# Read first few lines or just filtered columns to save time/bandwidth if possible, but pandas reads all.
# Actually I'll just mock the data frame to test the logic logic.

data = pd.DataFrame({
    "date": pd.to_datetime(["2021-01-01", "2021-01-02", "2021-01-03"]),
    "location": ["World", "World", "World"],
    "total_cases": [100, 110, 120],
    "new_cases": [100, 10, 10],
    "total_deaths": [1, 1, 1],
    "total_vaccinations": [0, 10, 20]
})

print("Original Data:")
print(data)

# Current logic
filtered_data = data # simplified
total_cases = filtered_data["total_cases"].sum()
print(f"Current Logic Total Cases (Sum of cumulative): {total_cases}") # Should be 330

# Proposed logic
# Get the latest entry for each location
latest_data = filtered_data.sort_values("date").groupby("location").tail(1)
correct_total_cases = latest_data["total_cases"].sum()
print(f"Correct Total Cases (Latest): {correct_total_cases}") # Should be 120
