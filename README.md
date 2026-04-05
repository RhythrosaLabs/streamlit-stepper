<p align="center">
  <img src="https://raw.githubusercontent.com/RhythrosaLabs/streamlit-stepper/main/assets/screenshot.svg" width="800" alt="streamlit-stepper screenshot" />
</p>

<h1 align="center">streamlit-stepper</h1>

<p align="center">
  <strong>A multi-step wizard component for <a href="https://streamlit.io">Streamlit</a></strong>
</p>

<p align="center">
  <a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/v/streamlit-stepper.svg?style=flat-square&color=818cf8" alt="PyPI version" /></a>
  <a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/pyversions/streamlit-stepper.svg?style=flat-square" alt="Python versions" /></a>
  <a href="https://github.com/RhythrosaLabs/streamlit-stepper/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" alt="License" /></a>
  <a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/dm/streamlit-stepper.svg?style=flat-square&color=34d399" alt="Downloads" /></a>
</p>

---

**streamlit-stepper** is a fully interactive multi-step wizard that runs inside any Streamlit application. Define steps with typed fields, get built-in validation, animated progress connectors, an auto-generated review step, and the final collected values back in Python — all with zero runtime dependencies beyond Streamlit.

## Features

### Step Navigation
- **Horizontal orientation** — tabs displayed across the top with animated fill connectors between steps
- **Vertical orientation** — sidebar-style step list; switchable at runtime via the `orientation` parameter
- **Click-to-jump** — click any previously completed step to jump back and edit
- **Dot-strip navigation** — a dot indicator at the bottom of each step shows overall progress

### Form Fields
- **Text inputs** — single-line text fields with optional placeholder hints
- **Textarea** — multi-line text areas for longer content
- **Select dropdowns** — pick from a list of predefined options
- **Required validation** — blocks the Next button and shows inline error hints when required fields are empty

### Review & Completion
- **Auto-generated review step** — any step with `"fields": []` automatically renders a summary of all prior entries
- **Completion screen** — displayed when the user clicks the final submit button
- **Structured return value** — all collected field values are returned to Python as a flat dictionary

### Visual Design
- **Animated connectors** — fill lines between step indicators animate as the user progresses
- **Step icons** — each step displays a configurable icon character (e.g. "◈", "①", "→")
- **Subtitles** — secondary descriptive text below each step label
- **Dark theme** — consistent dark UI designed to match Streamlit's dark mode

---

## Installation

```bash
pip install streamlit-stepper
```

## Quick Start

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
        "fields": [],
    },
]

result = st_stepper(steps, orientation="horizontal", key="wizard")

if result and result["completed"]:
    st.balloons()
    st.success(f"Created project: {result['values']['name']}")
    st.json(result["values"])
```

## API Reference

### `st_stepper`

```python
st_stepper(
    steps: list[dict],
    orientation: str = "horizontal",
    key: str | None = None,
) -> dict | None
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `steps` | `list[dict]` | required | Step definitions. See step schema below. |
| `orientation` | `str` | `"horizontal"` | Layout of the step indicator. `"horizontal"` (tabs across top) or `"vertical"` (sidebar list). |
| `key` | `str` or `None` | `None` | An optional key that uniquely identifies this component. Required when placing multiple steppers on one page. |

#### Return Value

Returns a `dict` after each step interaction, or `None` before any interaction.

```python
{
    "step":      int,    # index of the last completed step (0-based)
    "values":    dict,   # {field_key: entered_value} for all fields across all steps
    "completed": bool,   # True when the user clicks the final submit button
}
```

### Data Structures

#### Step

```python
{
    "label":    str,          # short name displayed in the step indicator (e.g. "Project")
    "subtitle": str,          # secondary text below the label
    "icon":     str,          # decorative character (e.g. "◈", "①", "→")
    "fields":   list[dict],   # field definitions for this step (empty = review step)
}
```

A step with `"fields": []` automatically renders as a **review summary** of all prior steps.

#### Field

```python
{
    "key":         str,          # returned as a key in result["values"]
    "label":       str,          # field display label
    "type":        str,          # "text" | "textarea" | "select"
    "placeholder": str,          # optional hint text (for text/textarea)
    "required":    bool,         # if True, blocks Next when empty
    "options":     list[str],    # required when type == "select"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `key` | `str` | Unique field key. Appears in `result["values"]`. |
| `label` | `str` | Display label shown above the input. |
| `type` | `str` | One of `"text"`, `"textarea"`, or `"select"`. |
| `placeholder` | `str` | Hint text for text/textarea fields. Optional. |
| `required` | `bool` | When `True`, the Next button is disabled until the field has a value. Inline error hints are shown. |
| `options` | `list[str]` | List of choices. Required when `type == "select"`. |

---

## Usage Examples

### Vertical Orientation

```python
result = st_stepper(steps, orientation="vertical", key="wizard")
```

### Multi-step Onboarding Form

```python
import streamlit as st
from streamlit_stepper import st_stepper

steps = [
    {
        "label": "Account",
        "subtitle": "Basic info",
        "icon": "①",
        "fields": [
            {"key": "email", "label": "Email", "type": "text",
             "placeholder": "you@example.com", "required": True},
            {"key": "name",  "label": "Full name", "type": "text",
             "required": True},
        ],
    },
    {
        "label": "Preferences",
        "subtitle": "Customize",
        "icon": "②",
        "fields": [
            {"key": "role", "label": "Role", "type": "select",
             "options": ["Developer", "Designer", "PM", "Other"], "required": True},
            {"key": "bio", "label": "Short bio", "type": "textarea",
             "placeholder": "Tell us about yourself…"},
        ],
    },
    {
        "label": "Confirm",
        "subtitle": "Review & submit",
        "icon": "✓",
        "fields": [],
    },
]

result = st_stepper(steps, key="onboarding")

if result and result["completed"]:
    st.success(f"Welcome, {result['values']['name']}!")
    st.json(result["values"])
```

### Collecting Values on Each Step

```python
result = st_stepper(steps, key="wizard")

if result:
    st.write(f"Currently on step {result['step'] + 1} of {len(steps)}")
    st.write("Values collected so far:", result["values"])

    if result["completed"]:
        # Process final submission
        save_to_database(result["values"])
        st.success("Saved!")
```

---

## Architecture

The component is built with **React 18** communicating with Streamlit via the bidirectional component API (`streamlit-component-lib`).

```
┌──────────────────────────────────────────────────────┐
│  Python (Streamlit)                                  │
│  st_stepper(steps, orientation, key)                 │
│       ↓ args                ↑ componentValue         │
├──────────────────────────────────────────────────────┤
│  React Frontend (iframe)                             │
│  ┌────────────────────────────────────────────────┐  │
│  │  Step Indicator (horizontal or vertical)       │  │
│  │  [◈ Project]──────[◉ Team]──────[◆ Review]    │  │
│  │   ✓ done     ════  active  ────  upcoming     │  │
│  ├────────────────────────────────────────────────┤  │
│  │  Step Content                                  │  │
│  │  ┌────────────────────────────────────┐        │  │
│  │  │  Field: Project name   [________] │        │  │
│  │  │  Field: Project type   [▼ select] │        │  │
│  │  └────────────────────────────────────┘        │  │
│  ├────────────────────────────────────────────────┤  │
│  │  Navigation: [Back]  ● ● ○  [Next]            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **Step indicator** — renders horizontal tabs or a vertical sidebar with animated fill connectors
- **Validation engine** — checks required fields before allowing navigation to the next step
- **Review renderer** — automatically summarizes all prior field values when a step has empty `fields`
- **State sync** — every navigation action calls `Streamlit.setComponentValue()` with the current step index and all collected values

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome / Edge 90+ | ✅ Full support |
| Firefox 90+ | ✅ Full support |
| Safari 15+ | ✅ Full support |
| Mobile browsers | ✅ Responsive layout |

## Requirements

- Python 3.8+
- Streamlit ≥ 1.28.0

## License

MIT — see [LICENSE](LICENSE) for details.

## Links

- **PyPI:** [https://pypi.org/project/streamlit-stepper/](https://pypi.org/project/streamlit-stepper/)
- **GitHub:** [https://github.com/RhythrosaLabs/streamlit-stepper](https://github.com/RhythrosaLabs/streamlit-stepper)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
- **Issues:** [https://github.com/RhythrosaLabs/streamlit-stepper/issues](https://github.com/RhythrosaLabs/streamlit-stepper/issues)
