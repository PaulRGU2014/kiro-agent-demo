const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const { runDebugAgent } = require("./agent/debugAgent");

app.post("/agent/debug", async (req, res) => {
  const { errorMessage, error_message } = req.body;
  const message = errorMessage || error_message;

  if (!message) {
    return res.status(400).json({ error: "errorMessage is required" });
  }

  try {
    const result = await runDebugAgent(message);
    return res.json(result);
  } catch (err) {
    console.error("/agent/debug failed:", err);
    return res.status(500).json({ error: "Failed to analyze error message" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});