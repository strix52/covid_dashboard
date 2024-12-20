import streamlit as st
import pandas as pd
import plotly.express as px

# Title and Description
st.title("🌍 COVID-19 Dashboard")
st.write("A simple dashboard to visualize global COVID-19 cases.")

# Load Data
@st.cache_data
def load_data():
    url = "https://covid.ourworldindata.org/data/owid-covid-data.csv"
    data = pd.read_csv(url)
    data = data[["date", "location", "total_cases", "new_cases", "total_deaths", "new_deaths", "total_vaccinations", "people_vaccinated", "people_fully_vaccinated"]]
    data['date'] = pd.to_datetime(data['date'])
    return data

data = load_data()

# Sidebar Filters
st.sidebar.header("Filter Options")
countries = st.sidebar.multiselect("Select Countries", data["location"].unique(), default=["World"])
date_range = st.sidebar.date_input("Select Date Range", [data['date'].min(), data['date'].max()])

# Filter Data
if "World" in countries:
    filtered_data = data[data["location"] == "World"]
else:
    filtered_data = data[data["location"].isin(countries)]
filtered_data = filtered_data[(filtered_data["date"] >= pd.to_datetime(date_range[0])) &
                              (filtered_data["date"] <= pd.to_datetime(date_range[1]))]

# Handle NaN values
filtered_data = filtered_data.fillna(0)

# Summary Statistics
st.sidebar.subheader("Summary Statistics")
total_cases = filtered_data["total_cases"].sum()
total_deaths = filtered_data["total_deaths"].sum()
total_vaccinations = filtered_data["total_vaccinations"].sum()
people_vaccinated = filtered_data["people_vaccinated"].sum()
people_fully_vaccinated = filtered_data["people_fully_vaccinated"].sum()

st.sidebar.write(f"Total Cases: {total_cases}")
st.sidebar.write(f"Total Deaths: {total_deaths}")
st.sidebar.write(f"Total Vaccinations: {total_vaccinations}")
st.sidebar.write(f"People Vaccinated: {people_vaccinated}")
st.sidebar.write(f"People Fully Vaccinated: {people_fully_vaccinated}")

# Plot Total Cases
st.subheader("Total Cases Over Time")
fig_cases = px.line(filtered_data, x="date", y="total_cases", color="location",
                    labels={"total_cases": "Total Cases", "date": "Date"})
st.plotly_chart(fig_cases, use_container_width=True)

# Plot New Cases
st.subheader("New Cases Over Time")
fig_new_cases = px.bar(filtered_data, x="date", y="new_cases", color="location",
                       labels={"new_cases": "New Cases", "date": "Date"})
st.plotly_chart(fig_new_cases, use_container_width=True)

# Plot Total Vaccinations
st.subheader("Total Vaccinations Over Time")
fig_vaccinations = px.line(filtered_data, x="date", y="total_vaccinations", color="location",
                           labels={"total_vaccinations": "Total Vaccinations", "date": "Date"})
st.plotly_chart(fig_vaccinations, use_container_width=True)

# Interactive Map
st.subheader("COVID-19 Spread Map")
fig_map = px.scatter_geo(filtered_data, locations="location", locationmode="country names",
                         color="total_cases", size="total_cases",
                         hover_name="location", animation_frame="date",
                         projection="natural earth",
                         color_continuous_scale=px.colors.sequential.Plasma,
                         size_max=50)

# Customize markers
fig_map.update_traces(marker=dict(line=dict(width=1, color='DarkSlateGrey')))

# Update layout for better aesthetics
fig_map.update_layout(
    title="Global COVID-19 Cases Over Time",
    geo=dict(
        showframe=False,
        showcoastlines=True,
        coastlinecolor="RebeccaPurple",
        projection_type='equirectangular'
    ),
    coloraxis_colorbar=dict(
        title="Total Cases",
        ticks="outside"
    )
)

st.plotly_chart(fig_map, use_container_width=True)

# Data Download Option
st.sidebar.download_button(label="Download Data as CSV", data=filtered_data.to_csv(), mime='text/csv')

# Data Source Acknowledgment
st.write("Data Source: [Our World in Data](https://covid.ourworldindata.org/)")

# Footer
st.markdown("""
    <style>
    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: blue;
        color: black;
        text-align: center;
        padding: 10px;
    }
    </style>
 
    """, unsafe_allow_html=True)
