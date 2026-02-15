import pandas as pd

# Mock data simulating cumulative values
data = pd.DataFrame({
    "date": pd.to_datetime(["2021-01-01", "2021-01-02", "2021-01-03"]),
    "location": ["World", "World", "World"],
    "total_cases": [100, 110, 120],
    "new_cases": [100, 10, 10],
    "total_deaths": [1, 1, 1],
    "total_vaccinations": [0, 10, 20],
    "people_vaccinated": [0, 5, 10],
    "people_fully_vaccinated": [0, 0, 5]
})

print("Original Data:")
print(data)

# Current logic (Sum of cumulative)
filtered_data = data # simplified
total_cases_old = filtered_data["total_cases"].sum()
print(f"Current Logic Total Cases (Sum of cumulative): {total_cases_old} (Should be 330, Expected: 120)")

# Proposed logic (Latest value in filtered range)
# Group by location, take the last row (sorted by date), and sum across locations
latest_data = filtered_data.sort_values("date").groupby("location").last().reset_index()

total_cases_new = latest_data["total_cases"].sum()
total_deaths_new = latest_data["total_deaths"].sum()
total_vaccinations_new = latest_data["total_vaccinations"].sum()
people_vaccinated_new = latest_data["people_vaccinated"].sum()
people_fully_vaccinated_new = latest_data["people_fully_vaccinated"].sum()

print(f"New Logic Total Cases (Latest): {total_cases_new}")
print(f"New Logic Total Deaths: {total_deaths_new}")
print(f"New Logic Total Vaccinations: {total_vaccinations_new}")
print(f"New Logic People Vaccinated: {people_vaccinated_new}")
print(f"New Logic People Fully Vaccinated: {people_fully_vaccinated_new}")

# Assert correctness
assert total_cases_new == 120, f"Expected 120, got {total_cases_new}"
assert total_deaths_new == 1, f"Expected 1, got {total_deaths_new}"
assert total_vaccinations_new == 20, f"Expected 20, got {total_vaccinations_new}"
assert people_vaccinated_new == 10, f"Expected 10, got {people_vaccinated_new}"
assert people_fully_vaccinated_new == 5, f"Expected 5, got {people_fully_vaccinated_new}"

print("Verification Successful!")
