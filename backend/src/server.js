require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const authorizeRole = require("./middleware/roleMiddleware");
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user
  });
});
app.get(
  "/captain-dashboard",
  verifyToken,
  authorizeRole("captain"),
  (req, res) => {
    res.json({
      message: "Welcome Captain"
    });
  }
);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});