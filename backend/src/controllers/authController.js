const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,$4)`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
      detail: error
    });
  }
};   // <-- THIS WAS MISSING

module.exports = {
  register
};