# 🌍 COVID-19 Dashboard

A simple dashboard to visualize global COVID-19 cases using Streamlit.

## Description

This project is a COVID-19 Dashboard built with Streamlit to provide an interactive visualization of global COVID-19 data. The dashboard allows users to filter data by country and date range, view summary statistics, and visualize data through various plots and an interactive map.

## Features

- Interactive COVID-19 data visualization
- Country-wise filtering
- Date range selection
- Summary statistics for cases, deaths, and vaccinations
- Line plots for total cases and vaccinations over time
- Bar plots for new cases over time
- Interactive map showing COVID-19 spread
- Downloadable datasets

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/strix52/covid_dashboard.git
    cd covid_dashboard
    ```

2. **Create a virtual environment**:
    ```sh
    python -m venv venv
    ```

3. **Activate the virtual environment**:
    - **Windows**:
      ```sh
      venv\Scripts\activate
      ```
    - **Unix/MacOS**:
      ```sh
      source venv/bin/activate
      ```

4. **Install the required dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

## Usage

1. **Run the Streamlit app**:
    ```sh
    streamlit run app.py
    ```

2. **Interact with the dashboard**:
    - Use the sidebar to filter data by countries and date range.
    - View summary statistics in the sidebar.
    - Explore the line plots for total cases and vaccinations, bar plots for new cases, and an interactive map showing COVID-19 spread.

3. **Download data**:
    - Click the "Download Data as CSV" button in the sidebar to download the filtered dataset.

## Dependencies

The project declares only the three packages imported directly by `app.py` in
`requirements.txt`. Their transitive dependencies are resolved by pip from the
current secure constraints published by those packages, rather than freezing a
stale 2024 environment into the application manifest.

- Streamlit 1.60.0
- pandas 3.0.5
- Plotly 6.9.0

Python 3.13 is used by the dependency-audit workflow.

## Data Source

The data is sourced from [Our World in Data](https://covid.ourworldindata.org/).

