const express = require("express");
const cors = require("cors");
const path = require("path");
const { processData } = require("./processor");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const IDENTITY = {
  user_id: process.env.USER_ID || "amanprajapati_07072006",
  email_id: process.env.EMAIL_ID || "ap3220@srmist.edu.in",
  college_roll_number: process.env.ROLL_NO || "RA2311003020174",
};

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "`data` must be an array of strings." });
    }

    const result = processData(data);

    return res.json({
      user_id: IDENTITY.user_id,
      email_id: IDENTITY.email_id,
      college_roll_number: IDENTITY.college_roll_number,
      hierarchies: result.hierarchies,
      invalid_entries: result.invalidEntries,
      duplicate_edges: result.duplicateEdges,
      summary: result.summary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/bfhl", (_req, res) => {
  res.json({ status: "ok", message: "BFHL API is running. Use POST /bfhl." });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`BFHL API running on http://localhost:${PORT}`);
});