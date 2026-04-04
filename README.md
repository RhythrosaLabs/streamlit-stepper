# streamlit-stepper

A multi-step wizard component for Streamlit. Define steps with typed fields, get built-in validation, animated progress connectors, a summary review step, and the final collected values back in Python.

![Stepper screenshot](https://raw.githubusercontent.com/yourusername/streamlit-stepper/main/docs/screenshot.png)

## Features

- Horizontal (tabs across top) and vertical (sidebar) orientations — switchable at runtime
- Animated fill connector between steps as you progress
- Per-field required validation — blocks Next and shows inline error hints
- Click completed steps to jump back
- Auto-generated review step that summarizes all entries
- Completion screen with collected values
- Dot-strip navigation at the bottom of each step
- Zero runtime dependencies beyond Streamlit

## Installation

```bash
pip install streamlit-stepper
```

## Quickstart

```python
import streamlit as st
from streamlit_stepper import st_stepper

steps = [
    {
        "label": "Project",
        "subtitle": "Name & describe",
        "icon": "◈",
        "fields": [
            {
                "key": "name",
                "label": "Project name",
                "type": "text",
                "placeholder": "e.g. Apollo Dashboard",
                "required": True,
            },
            {
                "key": "type",
                "label": "Project type",
                "type": "select",
                "options": ["Web App", "Data Pipeline", "ML Model", "API Service"],
                "required": True,
            },
        ],
    },
    {
        "label": "Team",
        "subtitle": "Add collaborators",
        "icon": "◉",
        "fields": [
            {
                "key": "owner",
                "label": "Owner email",
                "type": "text",
                "placeholder": "you@company.com",
                "required": True,
            },
            {
                "key": "size",
                "label": "Team size",
                "type": "select",
                "options": ["Solo", "2–5", "6–15", "15+"],
                "required": True,
            },
        ],
    },
    {
        "label": "Review",
        "subtitle": "Confirm & launch",
        "icon": "◆",
        "fields": [],  # empty fields = auto review step
    },
]

result = st_stepper(steps, orientation="horizontal", key="wizard")

if result and result["completed"]:
    st.balloons()
    st.success(f"Created project: {result['values']['name']}")
    st.json(result["values"])
```

## API

```python
st_stepper(steps, orientation="horizontal", key=None)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `steps` | `list[dict]` | required | Step definitions |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout of the step indicator |
| `key` | `str` | `None` | Streamlit widget key |

### Step schema

```python
{
    "label":    str,        # short name in the indicator (e.g. "Project")
    "subtitle": str,        # secondary text below label
    "icon":     str,        # decorative character (e.g. "◈", "①", "→")
    "fields": [
        {
            "key":         str,          # returned in result["values"]
            "label":       str,          # field display label
            "type":        str,          # "text" | "textarea" | "select"
            "placeholder": str,          # optional hint text
            "required":    bool,         # if True, blocks Next when empty
            "options":     list[str],    # required for type="select"
        }
    ]
}
```

A step with `"fields": []` renders as a review summary of all prior steps.

### Return value

```python
{
    "step":      int,   # index of the last completed step
    "values":    dict,  # {field_key: entered_value} for all fields
    "completed": bool,  # True when user clicks the final submit button
}
```

## Development

```bash
git clone https://github.com/yourusername/streamlit-stepper
cd streamlit-stepper

cd streamlit_stepper/frontend
npm install
npm start   # dev server on :3003

# separate terminal
cd ../..
pip install -e .
# Set _RELEASE = False in streamlit_stepper/__init__.py
streamlit run example.py
```

## License

MIT
