const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/agent/debug", async (req, res) => {
  const { errorMessage } = req.body;

  if (!errorMessage) {
    return res.status(400).json({ error: "errorMessage is required" });
  }


// For now, we simulate the AI agent.
//Later this is where Kiro / OpenAI / Bedrock would be called
  const result = {
    explanation: "This error indicates something is undefined.",
    likely_cause: "A variable or prop was used before being initialized.",
    suggested_fix:
      "Check where the variable is defined and add a null/undefined guard.",
    severity: "medium",
  };

  return res.json(result);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});