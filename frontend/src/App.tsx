import React, { useState, type SyntheticEvent } from "react";
import "./App.css";

type AgentResult = {
  explanation: string;
  likely_cause: string;
  suggested_fix: string;
  severity: "low" | "medium" | "high";
};

function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/agent/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error_message: errorMessage }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Could not reach the backend on port 4000");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Kiro-Style Debugging Agent</h1>
      <p className="subtitle">
        Paste a JavaScript/React error and get a structured analysis.
      </p>

      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <textarea
          className="textarea"
          rows={6}
          placeholder="Paste your error message here..."
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
        />
        <button
          className="button"
          type="submit"
          disabled={!errorMessage || loading}
        >
          {loading ? "Analyzing..." : "Analyze Error"} 
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result-box">
          <h2>Explanation</h2>
          <p>{result.explanation}</p>

          <h2>Likely Cause</h2>
          <p>{result.likely_cause}</p>

          <h2>Suggested Fix</h2>
          <p>{result.suggested_fix}</p>

          <h2>Severity</h2>
          <p className={`severity severity-${result.severity}`}>
            {result.severity}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
