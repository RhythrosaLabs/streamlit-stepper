import { useState, useEffect, useRef } from "react";
import { Streamlit } from "streamlit-component-lib";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#f7f6f2",
  surface: "#ffffff",
  ink: "#0f0e0c",
  inkMuted: "#8a8880",
  inkFaint: "#c8c6c0",
  accent: "#1a1a1a",
  accentWarm: "#c8552a",
  accentGold: "#d4a843",
  done: "#2a7a4f",
  border: "#e2e0da",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
  shadowLg: "0 8px 40px rgba(0,0,0,0.1)",
  radius: 14,
  mono: "'Fira Code', 'Courier New', monospace",
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
};

// ── Sample step definitions ───────────────────────────────────────────────────
const DEMO_STEPS = [
  {
    id: "project",
    label: "Project",
    subtitle: "Name & describe",
    icon: "◈",
    fields: [
      { key: "name", label: "Project name", type: "text", placeholder: "e.g. Apollo Dashboard", required: true },
      { key: "description", label: "Description", type: "textarea", placeholder: "What does this project do?", required: false },
      { key: "type", label: "Project type", type: "select", options: ["Web App", "Data Pipeline", "ML Model", "API Service"], required: true },
    ],
  },
  {
    id: "team",
    label: "Team",
    subtitle: "Add collaborators",
    icon: "◉",
    fields: [
      { key: "owner", label: "Owner email", type: "text", placeholder: "you@company.com", required: true },
      { key: "size", label: "Team size", type: "select", options: ["Solo", "2–5", "6–15", "15+"], required: true },
      { key: "timezone", label: "Primary timezone", type: "select", options: ["UTC−8 Pacific", "UTC−5 Eastern", "UTC+0 London", "UTC+1 Paris", "UTC+5:30 Mumbai", "UTC+8 Singapore", "UTC+9 Tokyo"], required: false },
    ],
  },
  {
    id: "stack",
    label: "Stack",
    subtitle: "Tech choices",
    icon: "◇",
    fields: [
      { key: "language", label: "Primary language", type: "select", options: ["Python", "TypeScript", "Go", "Rust", "Java"], required: true },
      { key: "hosting", label: "Hosting", type: "select", options: ["AWS", "GCP", "Azure", "Vercel", "Self-hosted"], required: true },
      { key: "repo", label: "Repository URL", type: "text", placeholder: "https://github.com/org/repo", required: false },
    ],
  },
  {
    id: "review",
    label: "Review",
    subtitle: "Confirm & launch",
    icon: "◆",
    fields: [],
  },
];

// ── Utilities ─────────────────────────────────────────────────────────────────
function validateStep(step, values) {
  for (const f of step.fields) {
    if (f.required && !values[f.key]?.trim()) return false;
  }
  return true;
}

// ── Step indicator node ───────────────────────────────────────────────────────
function StepNode({ step, index, status, onClick, isLast, orientation }) {
  const isDone = status === "done";
  const isActive = status === "active";
  const isPending = status === "pending";

  const nodeSize = 40;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: orientation === "vertical" ? "row" : "column",
        alignItems: "center",
        gap: orientation === "vertical" ? 16 : 8,
        flex: orientation === "horizontal" ? 1 : undefined,
        position: "relative",
        cursor: isDone || isActive ? "pointer" : "default",
      }}
      onClick={() => (isDone || isActive) && onClick(index)}
    >
      {/* Node circle */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: nodeSize,
            height: nodeSize,
            borderRadius: "50%",
            background: isDone ? T.done : isActive ? T.ink : T.surface,
            border: isDone
              ? `2px solid ${T.done}`
              : isActive
              ? `2px solid ${T.ink}`
              : `2px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: isActive ? `0 0 0 4px rgba(15,14,12,0.08)` : "none",
            zIndex: 2,
            position: "relative",
          }}
        >
          {isDone ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span
              style={{
                fontFamily: T.mono,
                fontSize: 13,
                color: isActive ? "white" : T.inkFaint,
                transition: "color 0.3s",
                lineHeight: 1,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
        </div>

        {/* Pulse ring for active */}
        {isActive && (
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              border: `1.5px solid rgba(15,14,12,0.15)`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Label block */}
      <div
        style={{
          textAlign: orientation === "horizontal" ? "center" : "left",
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontFamily: T.display,
            fontSize: isActive ? 15 : 14,
            fontWeight: isActive ? 700 : 400,
            color: isDone ? T.done : isActive ? T.ink : T.inkMuted,
            letterSpacing: "-0.01em",
            transition: "all 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          {step.label}
        </div>
        <div
          style={{
            fontFamily: T.body,
            fontSize: 11,
            color: isActive ? T.inkMuted : T.inkFaint,
            marginTop: 1,
            transition: "color 0.3s",
            whiteSpace: "nowrap",
          }}
        >
          {step.subtitle}
        </div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div
          style={{
            position: orientation === "vertical" ? "absolute" : "static",
            top: orientation === "vertical" ? nodeSize + 6 : undefined,
            left: orientation === "vertical" ? nodeSize / 2 - 1 : undefined,
            width: orientation === "vertical" ? 2 : undefined,
            height: orientation === "vertical" ? "calc(100% - 54px)" : 2,
            flex: orientation === "horizontal" ? 1 : undefined,
            background: T.border,
            overflow: "hidden",
            borderRadius: 2,
            marginTop: orientation === "horizontal" ? undefined : 0,
          }}
        >
          <div
            style={{
              width: isDone ? "100%" : "0%",
              height: "100%",
              background: T.done,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1)",
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Field renderer ────────────────────────────────────────────────────────────
function Field({ field, value, onChange, touched, showErrors }) {
  const isInvalid = showErrors && field.required && !value?.trim();

  const baseInput = {
    width: "100%",
    fontFamily: T.body,
    fontSize: 14,
    color: T.ink,
    background: isInvalid ? "rgba(200,85,42,0.04)" : T.bg,
    border: `1.5px solid ${isInvalid ? T.accentWarm : touched ? T.inkFaint : T.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    resize: "vertical",
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: T.body,
          fontSize: 12,
          fontWeight: 500,
          color: isInvalid ? T.accentWarm : T.inkMuted,
          marginBottom: 6,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}
      >
        {field.label}
        {field.required && (
          <span style={{ color: T.accentWarm, fontSize: 14 }}>·</span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          style={{ ...baseInput }}
          onFocus={(e) => { e.target.style.borderColor = T.ink; e.target.style.boxShadow = `0 0 0 3px rgba(15,14,12,0.06)`; }}
          onBlur={(e) => { e.target.style.borderColor = isInvalid ? T.accentWarm : T.inkFaint; e.target.style.boxShadow = "none"; }}
        />
      ) : field.type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...baseInput, cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a8880' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
          onFocus={(e) => { e.target.style.borderColor = T.ink; e.target.style.boxShadow = `0 0 0 3px rgba(15,14,12,0.06)`; }}
          onBlur={(e) => { e.target.style.borderColor = isInvalid ? T.accentWarm : T.inkFaint; e.target.style.boxShadow = "none"; }}
        >
          <option value="">Select…</option>
          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          style={{ ...baseInput }}
          onFocus={(e) => { e.target.style.borderColor = T.ink; e.target.style.boxShadow = `0 0 0 3px rgba(15,14,12,0.06)`; }}
          onBlur={(e) => { e.target.style.borderColor = isInvalid ? T.accentWarm : T.inkFaint; e.target.style.boxShadow = "none"; }}
        />
      )}

      {isInvalid && (
        <div style={{ fontFamily: T.body, fontSize: 11, color: T.accentWarm, marginTop: 4 }}>
          This field is required
        </div>
      )}
    </div>
  );
}

// ── Review panel ──────────────────────────────────────────────────────────────
function ReviewPanel({ steps, values }) {
  return (
    <div>
      <div style={{ fontFamily: T.display, fontSize: 22, color: T.ink, marginBottom: 6 }}>
        Ready to launch
      </div>
      <div style={{ fontFamily: T.body, fontSize: 14, color: T.inkMuted, marginBottom: 28 }}>
        Review your configuration before submitting.
      </div>
      {steps.slice(0, -1).map((step) => (
        <div key={step.id} style={{ marginBottom: 20 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 10, paddingBottom: 8,
            borderBottom: `1px solid ${T.border}`,
          }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkFaint }}>{step.icon}</span>
            <span style={{ fontFamily: T.display, fontSize: 14, fontWeight: 700, color: T.ink }}>{step.label}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
            {step.fields.map((f) => (
              <div key={f.key}>
                <div style={{ fontFamily: T.body, fontSize: 11, color: T.inkFaint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontFamily: T.body, fontSize: 13, color: values[f.key] ? T.ink : T.inkFaint, fontStyle: values[f.key] ? "normal" : "italic" }}>
                  {values[f.key] || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Stepper ──────────────────────────────────────────────────────────────
export default function Stepper() {
  const [current, setCurrent] = useState(0);
  const [values, setValues] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orientation, setOrientation] = useState("horizontal"); // "horizontal" | "vertical"
  const [touched, setTouched] = useState({});
  const contentRef = useRef(null);

  const [steps, setSteps] = useState(DEMO_STEPS);
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const isValid = validateStep(step, values);

  // ── Streamlit lifecycle ──────────────────────────────────────────────────
  const readyRef = useRef(false);

  useEffect(() => {
    const onRender = (event) => {
      const args = event.detail.args || {};
      if (!readyRef.current) {
        if (args.steps) {
          setSteps(args.steps.map((s, i) => ({ id: s.id || `step_${i}`, ...s })));
        }
        if (args.orientation) setOrientation(args.orientation);
        readyRef.current = true;
      }
      Streamlit.setFrameHeight();
    };
    Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender);
    Streamlit.setComponentReady();
    return () => Streamlit.events.removeEventListener(Streamlit.RENDER_EVENT, onRender);
  }, []);

  useEffect(() => { Streamlit.setFrameHeight(); });

  const getStatus = (i) => {
    if (i < current) return "done";
    if (i === current) return "active";
    return "pending";
  };

  const handleNext = () => {
    if (!isValid) { setShowErrors(true); return; }
    setShowErrors(false);
    if (isLast) {
      setCompleted(true);
      Streamlit.setComponentValue({ step: current, values, completed: true });
      return;
    }
    setCurrent((c) => c + 1);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const handleBack = () => {
    setShowErrors(false);
    setCurrent((c) => Math.max(0, c - 1));
  };

  const handleJump = (i) => {
    setShowErrors(false);
    setCurrent(i);
  };

  const handleReset = () => {
    setCurrent(0);
    setValues({});
    setShowErrors(false);
    setCompleted(false);
    setTouched({});
  };

  // ── Completed screen ──────────────────────────────────────────────────────
  if (completed) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&family=Fira+Code:wght@400&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: T.body }}>
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.done, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7L26 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontFamily: T.display, fontSize: 32, color: T.ink, marginBottom: 10 }}>All done.</div>
            <div style={{ fontFamily: T.body, fontSize: 15, color: T.inkMuted, lineHeight: 1.6, marginBottom: 32 }}>
              Your project <strong style={{ color: T.ink }}>{values.name || "Untitled"}</strong> has been configured and is ready to launch.
            </div>
            <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: 20, textAlign: "left", marginBottom: 24 }}>
              {steps.slice(0, -1).map((s) => (
                <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ color: T.done, marginTop: 1 }}>✓</span>
                  <div>
                    <span style={{ fontFamily: T.display, fontSize: 13, fontWeight: 700, color: T.ink }}>{s.label}</span>
                    <span style={{ fontFamily: T.body, fontSize: 12, color: T.inkMuted }}> — {s.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleReset} style={{ fontFamily: T.body, fontSize: 13, color: T.inkMuted, background: "none", border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 24px", cursor: "pointer" }}>
              Start over
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&family=Fira+Code:wght@400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.15); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.body }}>

        {/* Top bar */}
        <div style={{ borderBottom: `1px solid ${T.border}`, background: T.surface, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: T.display, fontSize: 17, color: T.ink, fontWeight: 700 }}>New Project</span>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.inkFaint, background: T.bg, padding: "2px 8px", borderRadius: 4 }}>
              {current + 1} / {steps.length}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["horizontal", "vertical"].map((o) => (
              <button key={o} onClick={() => setOrientation(o)} style={{
                fontFamily: T.mono, fontSize: 10, color: orientation === o ? T.ink : T.inkFaint,
                background: orientation === o ? T.bg : "none",
                border: `1px solid ${orientation === o ? T.border : "transparent"}`,
                borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>{o}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: orientation === "vertical" ? "row" : "column", minHeight: "calc(100vh - 53px)" }}>

          {/* ── Sidebar / top indicator ─────────────────────────────────── */}
          {orientation === "vertical" ? (
            <div style={{
              width: 240, flexShrink: 0, padding: "36px 28px",
              borderRight: `1px solid ${T.border}`,
              background: T.surface,
              display: "flex", flexDirection: "column", gap: 0,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, color: T.inkFaint, letterSpacing: "0.15em", marginBottom: 28, textTransform: "uppercase" }}>Steps</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 32, position: "relative" }}>
                {steps.map((s, i) => (
                  <StepNode
                    key={s.id}
                    step={s}
                    index={i}
                    status={getStatus(i)}
                    onClick={handleJump}
                    isLast={i === steps.length - 1}
                    orientation="vertical"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: "28px 40px 0", background: T.surface, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {steps.map((s, i) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : undefined }}>
                    <StepNode
                      step={s}
                      index={i}
                      status={getStatus(i)}
                      onClick={handleJump}
                      isLast={i === steps.length - 1}
                      orientation="horizontal"
                    />
                    {i < steps.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: T.border, margin: "0 8px", marginBottom: 20, overflow: "hidden", borderRadius: 2 }}>
                        <div style={{ height: "100%", background: T.done, width: i < current ? "100%" : "0%", transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)", borderRadius: 2 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Content area ─────────────────────────────────────────────── */}
          <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: orientation === "vertical" ? "48px 56px" : "40px 40px 24px" }}>
            <div style={{ maxWidth: 560, animation: "fadeSlideIn 0.3s ease" }} key={current}>

              {/* Step header */}
              {!isLast && (
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: T.mono, fontSize: 18, color: T.inkFaint }}>{step.icon}</span>
                    <span style={{ fontFamily: T.display, fontSize: 26, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em" }}>
                      {step.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: T.body, fontSize: 14, color: T.inkMuted }}>
                    {step.subtitle}
                  </div>
                </div>
              )}

              {/* Fields or review */}
              <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, padding: "28px 28px 8px", boxShadow: T.shadow, marginBottom: 24 }}>
                {isLast ? (
                  <ReviewPanel steps={steps} values={values} />
                ) : (
                  step.fields.map((f) => (
                    <Field
                      key={f.key}
                      field={f}
                      value={values[f.key]}
                      onChange={(v) => {
                        setValues((prev) => ({ ...prev, [f.key]: v }));
                        setTouched((prev) => ({ ...prev, [f.key]: true }));
                      }}
                      touched={touched[f.key]}
                      showErrors={showErrors}
                    />
                  ))
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={handleBack}
                  disabled={current === 0}
                  style={{
                    fontFamily: T.body, fontSize: 13, color: current === 0 ? T.inkFaint : T.inkMuted,
                    background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
                    padding: "10px 20px", cursor: current === 0 ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => current > 0 && (e.currentTarget.style.borderColor = T.ink)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                >
                  ← Back
                </button>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Step dots */}
                  {steps.map((_, i) => (
                    <div key={i} style={{
                      width: i === current ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i < current ? T.done : i === current ? T.ink : T.border,
                      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                      cursor: i < current ? "pointer" : "default",
                    }}
                      onClick={() => i < current && handleJump(i)}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  style={{
                    fontFamily: T.body, fontSize: 13, fontWeight: 500,
                    color: "white",
                    background: isLast ? T.done : T.ink,
                    border: "none", borderRadius: 8,
                    padding: "10px 24px", cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: isLast ? `0 4px 16px rgba(42,122,79,0.3)` : `0 4px 16px rgba(15,14,12,0.15)`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                >
                  {isLast ? "Launch project →" : "Continue →"}
                </button>
              </div>

              {/* Validation hint */}
              {showErrors && !isValid && (
                <div style={{
                  marginTop: 16, fontFamily: T.body, fontSize: 12,
                  color: T.accentWarm, textAlign: "center",
                  animation: "fadeSlideIn 0.2s ease",
                }}>
                  Please fill in all required fields to continue.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
