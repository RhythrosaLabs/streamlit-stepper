# Changelog

## 0.2.0

- Wire up Streamlit bidirectional communication (setComponentReady, RENDER_EVENT, setComponentValue)
- Initialize steps and orientation from Python `st_stepper(steps, orientation)` args
- Auto-generate step `id` fields when missing from Python-side definitions
- Return `{step, values, completed}` to Python on wizard completion
- Add `Framework :: Streamlit` classifier to setup.py
- Add project_urls (Bug Tracker, Changelog) to setup.py
- Fix .gitignore: stop ignoring frontend build dir (required for PyPI)

## 0.1.1

- Set author to Dan Sheils

## 0.1.0

- Initial release

