<div align="center">

# 🪜 streamlit-stepper

**A multi-step wizard component for Streamlit — typed fields, validation, animated progress, and structured return values**

<a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/v/streamlit-stepper.svg?style=flat-square&color=818cf8" alt="PyPI version" /></a>
<a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/pyversions/streamlit-stepper.svg?style=flat-square" alt="Python versions" /></a>
<a href="https://pypi.org/project/streamlit-stepper/"><img src="https://img.shields.io/pypi/dm/streamlit-stepper.svg?style=flat-square&color=34d399" alt="Downloads" /></a>
<img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />

</div>

---

`streamlit-stepper` is a fully interactive multi-step wizard for Streamlit. Define steps with typed form fields, get built-in validation, animated progress connectors, an auto-generated review step, and the final collected values back in Python.

## ✨ Features

- **Horizontal & vertical orientations** — switchable at runtime via the `orientation` parameter
- **Click-to-jump** — return to any completed step to edit values
- **Field types** — text input, textarea, select dropdown with options
- **Required validation** — blocks the Next button and shows inline error hints
- **Auto-generated review step** — any step with empty `fields` auto-renders a summary of prior entries
- **Completion screen** — displayed after the final submit
- **Structured return value** — all field values returned to Python as a flat dictionary
- **Dot-strip navigation** — bottom dot indicator shows overall progress

## 🚀 Quick Start

```bash
pip install streamlit-stepper
```

```python
import streamlit as st
from streamlit_stepper import stepper

result = stepper(steps=[
    {"title": "Your Info", "fields": [
        {"id": "name",  "label": "Name",  "type": "text",   "required": True},
        {"id": "email", "label": "Email", "type": "text",   "required": True},
    ]},
    {"title": "Plan",     "fields": [
        {"id": "plan",  "label": "Plan",  "type": "select", "options": ["Free", "Pro", "Enterprise"]},
    ]},
    {"title": "Review",   "fields": []},
])
st.write(result)
```

## 🛠️ Tech Stack

- **React + TypeScript** — frontend component
- **Python / Streamlit** — backend integration
- **PyPI** — distributed as `streamlit-stepper`

## 🤝 Contributing

PRs welcome. Open an issue first for major changes.

## 📄 License

MIT

## 💛 Support

If streamlit-stepper simplifies your onboarding flows, consider supporting development:

👉 [Donate via PayPal](https://paypal.me/noodlebake) — @noodlebake

---
<div align="center">Made with ❤️ by <a href="https://github.com/RhythrosaLabs">RhythrosaLabs</a></div>
