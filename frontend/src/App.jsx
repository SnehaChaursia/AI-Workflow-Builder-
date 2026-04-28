import { useState } from "react";
import axios from "axios";

export default function App() {
  const [input, setInput] = useState("");
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuild = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setWorkflow(null);

    try {
      const res = await axios.post("http://localhost:8000/parse-workflow", {
        text: input,
      });
      setWorkflow(res.data);
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const serviceColors = {
    Gmail: "#EA4335",
    Slack: "#4A154B",
    "Google Sheets": "#34A853",
    Notion: "#000000",
    WhatsApp: "#25D366",
    Trello: "#0052CC",
    Default: "#6366f1",
  };

  const getColor = (service) =>
    serviceColors[service] || serviceColors["Default"];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚡ Workflow Builder</h1>
        <p style={styles.subtitle}>
          Describe your workflow in plain English — AI will build it instantly
        </p>
      </div>

      {/* Input Section */}
      <div style={styles.inputCard}>
        <textarea
          style={styles.textarea}
          placeholder='Try: "When a Google Form is submitted, save to Sheets and send a Slack message"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={handleBuild}
          disabled={loading}
        >
          {loading ? "⚙️ Building..." : "⚡ Build Workflow"}
        </button>
      </div>

      {/* Error */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Workflow Output */}
      {workflow && (
        <div style={styles.outputSection}>

          {/* Workflow Name */}
          <div style={styles.workflowHeader}>
            <h2 style={styles.workflowName}>🔁 {workflow.workflow_name}</h2>
           {workflow.n8n.success && (
  <a
    href={workflow.n8n.workflow_url}
    target="_blank"
    rel="noreferrer"
    style={styles.n8nButton}
  >
    🔗 Open in n8n
  </a>
)}
          </div>

          {/* Trigger Block */}
          <div style={styles.triggerBlock}>
            <span style={styles.triggerLabel}>TRIGGER</span>
            <p style={styles.triggerText}>⚡ {workflow.trigger}</p>
          </div>

          {/* Arrow */}
          <div style={styles.arrow}>↓</div>

          {/* Steps */}
          {workflow.steps.map((step, index) => (
            <div key={index}>
              <div
                style={{
                  ...styles.stepBlock,
                  borderLeft: `4px solid ${getColor(step.service)}`,
                }}
              >
                <div style={styles.stepTop}>
                  <span
                    style={{
                      ...styles.stepNumber,
                      background: getColor(step.service),
                    }}
                  >
                    {step.step_number}
                  </span>
                  <div>
                    <p style={styles.stepAction}>{step.action}</p>
                    <span
                      style={{
                        ...styles.serviceBadge,
                        background: getColor(step.service) + "22",
                        color: getColor(step.service),
                      }}
                    >
                      {step.service}
                    </span>
                  </div>
                </div>
                <p style={styles.stepDescription}>{step.description}</p>
              </div>

              {/* Arrow between steps */}
              {index < workflow.steps.length - 1 && (
                <div style={styles.arrow}>↓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: 0,
    background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "1rem",
    marginTop: "10px",
  },
  inputCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "700px",
    margin: "0 auto 30px",
    backdropFilter: "blur(10px)",
  },
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "14px",
    color: "#fff",
    fontSize: "0.95rem",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "14px",
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    transition: "opacity 0.2s",
  },
  error: {
    background: "#ff000022",
    border: "1px solid #ff000055",
    color: "#ff6b6b",
    padding: "12px 20px",
    borderRadius: "10px",
    maxWidth: "700px",
    margin: "0 auto 20px",
    textAlign: "center",
  },
  outputSection: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  workflowHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },
  workflowName: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: 0,
  },
  workflowSummary: {
    color: "#94a3b8",
    marginTop: "6px",
  },
  triggerBlock: {
    background: "linear-gradient(135deg, #f59e0b22, #f59e0b11)",
    border: "1px solid #f59e0b55",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  triggerLabel: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#f59e0b",
    letterSpacing: "2px",
  },
  triggerText: {
    margin: "6px 0 0",
    fontSize: "1rem",
    fontWeight: "600",
  },
  arrow: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#475569",
    margin: "8px 0",
  },
  stepBlock: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "16px 20px",
  },
  stepTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  stepNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "700",
    flexShrink: 0,
  },
  stepAction: {
    margin: 0,
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  serviceBadge: {
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "2px 10px",
    borderRadius: "20px",
    marginTop: "4px",
    display: "inline-block",
  },
  stepDescription: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.85rem",
    paddingLeft: "40px",
  },
  n8nButton: {
  display: "inline-block",
  marginTop: "12px",
  padding: "10px 24px",
  background: "linear-gradient(90deg, #f59e0b, #ef4444)",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: "700",
  textDecoration: "none",
  fontSize: "0.9rem",
},
};