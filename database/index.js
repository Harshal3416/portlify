const express = require("express");
const pool = require("./db/db");

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});