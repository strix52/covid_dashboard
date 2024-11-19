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

The project requires the following Python packages, specified in `requirements.txt`:
- altair==5.4.1
- attrs==24.2.0
- blinker==1.9.0
- cachetools==5.5.0
- certifi==2024.8.30
- charset-normalizer==3.4.0
- click==8.1.7
- colorama==0.4.6
- gitdb==4.0.11
- GitPython==3.1.43
- idna==3.10
- Jinja2==3.1.4
- jsonschema==4.23.0
- jsonschema-specifications==2024.10.1
- markdown-it-py==3.0.0
- MarkupSafe==3.0.2
- mdurl==0.1.2
- narwhals==1.13.5
- numpy==2.1.3
- packaging==24.2
- pandas==2.2.3
- pillow==11.0.0
- plotly==5.24.1
- protobuf==5.28.3
- pyarrow==18.0.0
- pydeck==0.9.1
- Pygments==2.18.0
- python-dateutil==2.9.0.post0
- pytz==2024.2
- referencing==0.35.1
- requests==2.32.3
- rich==13.9.4
- rpds-py==0.21.0
- six==1.16.0
- smmap==5.0.1
- streamlit==1.40.1
- tenacity==9.0.0
- toml==0.10.2
- tornado==6.4.1
- typing_extensions==4.12.2
- tzdata==2024.2
- urllib3==2.2.3
- watchdog==6.0.0

## Data Source

The data is sourced from [Our World in Data](https://covid.ourworldindata.org/).

