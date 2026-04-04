import os
import streamlit.components.v1 as components

_RELEASE = True

if _RELEASE:
    _component_func = components.declare_component(
        "streamlit_stepper",
        path=os.path.join(os.path.dirname(__file__), "frontend/build"),
    )
else:
    _component_func = components.declare_component(
        "streamlit_stepper",
        url="http://localhost:3001",
    )


def st_stepper(steps, orientation="horizontal", key=None):
    """
    Render a multi-step wizard with validated fields and progress tracking.

    Parameters
    ----------
    steps : list[dict]
        Ordered list of step definitions. Each dict accepts:

        - ``label`` (str): short step name shown in the indicator
        - ``subtitle`` (str): secondary label shown below
        - ``icon`` (str): single character/symbol shown in the header (e.g. "◈")
        - ``fields`` (list[dict]): form fields for this step. Each field::

              {
                  "key":         str,           # unique key, returned in values
                  "label":       str,           # display label
                  "type":        str,           # "text" | "textarea" | "select"
                  "placeholder": str,           # optional
                  "required":    bool,          # blocks Next if empty
                  "options":     list[str],     # required for type="select"
              }

    orientation : {"horizontal", "vertical"}
        Layout of the step indicator. "horizontal" shows steps across the top;
        "vertical" shows a sidebar. Default "horizontal".
    key : str, optional
        Streamlit widget key.

    Returns
    -------
    dict | None
        On final submission returns::

            {
                "step":      int,         # 0-indexed completed step count
                "values":    dict,        # {field_key: value} for all fields
                "completed": bool,        # True when user clicks the final button
            }

        Returns None until completion.

    Example
    -------
    >>> from streamlit_stepper import st_stepper
    >>>
    >>> steps = [
    ...     {
    ...         "label": "Basics", "subtitle": "Name & type", "icon": "◈",
    ...         "fields": [
    ...             {"key": "name", "label": "Project name", "type": "text", "required": True},
    ...             {"key": "type", "label": "Type", "type": "select",
    ...              "options": ["Web App", "API", "ML Model"], "required": True},
    ...         ],
    ...     },
    ...     {
    ...         "label": "Review", "subtitle": "Confirm", "icon": "◆",
    ...         "fields": [],
    ...     },
    ... ]
    >>>
    >>> result = st_stepper(steps, orientation="horizontal", key="wizard")
    >>> if result and result["completed"]:
    ...     st.success(f"Created: {result['values']['name']}")
    """
    return _component_func(steps=steps, orientation=orientation, key=key, default=None)
