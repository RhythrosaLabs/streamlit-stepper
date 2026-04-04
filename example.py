import streamlit as st
from streamlit_stepper import st_stepper

st.set_page_config(page_title="Stepper Demo", layout="wide")
st.title("🪜 streamlit-stepper demo")

STEPS = [
    {
        "label": "Project", "subtitle": "Name & describe", "icon": "◈",
        "fields": [
            {"key": "name",        "label": "Project name", "type": "text",
             "placeholder": "e.g. Apollo Dashboard", "required": True},
            {"key": "description", "label": "Description",  "type": "textarea",
             "placeholder": "What does this project do?", "required": False},
            {"key": "type",        "label": "Project type", "type": "select",
             "options": ["Web App", "Data Pipeline", "ML Model", "API Service"], "required": True},
        ],
    },
    {
        "label": "Team", "subtitle": "Add collaborators", "icon": "◉",
        "fields": [
            {"key": "owner",    "label": "Owner email",      "type": "text",
             "placeholder": "you@company.com", "required": True},
            {"key": "size",     "label": "Team size",        "type": "select",
             "options": ["Solo", "2–5", "6–15", "15+"], "required": True},
            {"key": "timezone", "label": "Primary timezone", "type": "select",
             "options": ["UTC−8 Pacific", "UTC−5 Eastern", "UTC+0 London",
                         "UTC+1 Paris", "UTC+5:30 Mumbai", "UTC+8 Singapore"], "required": False},
        ],
    },
    {
        "label": "Review", "subtitle": "Confirm & launch", "icon": "◆",
        "fields": [],
    },
]

result = st_stepper(STEPS, orientation="horizontal", key="demo_wizard")

if result and result.get("completed"):
    st.balloons()
    st.success(f"Project **{result['values'].get('name', 'Untitled')}** created!")
    st.json(result["values"])
