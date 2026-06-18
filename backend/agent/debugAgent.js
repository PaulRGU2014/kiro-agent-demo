// This file represents a Kiro-style agent template.
// It defines: role, goal, rules, schema, and the runtime wrapper.
const OpenAI = require("openai");

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const steeringPrompt = `
You are a senior frontend engineer.

Goal:
- Analyze JavaScript/TypeScript/React error messages.
- Explain what the error means.
- Infer the most likely root cause.
- Suggest a concrete fix.

Rules:
- If you are unsure, say you are unsure.
- Do NOT invent APIs or libraries that are not mentioned.
- Respond ONLY in valid JSON matching this schema:

{
  "explanation": string,
  "likely_cause": string,
  "suggested_fix": string,
  "severity": "low" | "medium" | "high"
}
`;

async function runDebugAgent(errorMessage) {
  const userPrompt = `Error message:\n${errorMessage}`;

  // Use the model when credentials are available; otherwise fall back to a
  // deterministic local response so the server can still run.
  const aiResponse = client
    ? await callModel(steeringPrompt, userPrompt)
    : await simulateModel(steeringPrompt, userPrompt);

  // Parse JSON safely
  try {
    return JSON.parse(aiResponse);
  } catch (err) {
    console.error("Invalid JSON from model:", err);
    return {
      explanation: "Model returned invalid JSON.",
      likely_cause: "Prompt or model configuration needs tightening.",
      suggested_fix: "Add stricter schema enforcement or post-processing.",
      severity: "medium",
    };
  }
}

// Simulated model call
async function callModel(systemPrompt, userPrompt) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
}

async function simulateModel(systemPrompt, userPrompt) {
  return JSON.stringify({
    explanation: `Simulated analysis for: ${userPrompt}`,
    likely_cause: "No OpenAI API key is configured, so the backend is using its local fallback.",
    suggested_fix: "Set OPENAI_API_KEY in backend/.env if you want live model responses.",
    severity: "medium",
  });
}

module.exports = { runDebugAgent };
