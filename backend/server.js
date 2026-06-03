require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is working");
});
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  try {
    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            error: "Database error"
          });
        }

        // Existing user
        if (result.length > 0) {
          return res.status(400).json({
            error: "Email already exists"
          });
        }

        // Hash password
        const hashedPassword =
          await bcrypt.hash(password, 10);

        // Insert user
        // Insert user
        db.query(
          "INSERT INTO users(name,email,password) VALUES (?,?,?)",
          [name, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.log("Signup Error:", err);
              return res.status(500).json({
                error: err.message
              });
            }
            res.json({
              message: "User registered successfully"
            });

          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password required"
    });
  }

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {

      if (err) {
        return res.status(500).json({
          error: "Database error"
        });
      }

      // User not found
      if (result.length === 0) {
        return res.status(400).json({
          error: "User not found"
        });
      }

      const user = result[0];

      // Compare passwords
      const valid = await bcrypt.compare(
        password,
        user.password
      );

      if (!valid) {
        return res.status(400).json({
          error: "Invalid password"
        });
      }

      // JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "7d" }
      );

      // Response
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });

    }
  );

});
app.get("/api/data", auth, async (req, res) => {

  const location = req.query.location;

  if (!location) {
    return res.status(400).json({
      error: "Location required"
    });
  }

  try {

    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${process.env.OPENCAGE_KEY}`
    );

    if (!geoRes.data.results.length) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    const { lat, lng } =
      geoRes.data.results[0].geometry;

    const currentRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_KEY}`
    );

    const now =
      Math.floor(Date.now() / 1000);

    const past =
      now - 7 * 24 * 60 * 60;

    const historyRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lng}&start=${past}&end=${now}&appid=${process.env.OPENWEATHER_KEY}`
    );

    const current =
      currentRes.data.list[0];

    const history =
      historyRes.data.list || [];

    const map = {};

    history.forEach((item) => {

      const date =
        new Date(item.dt * 1000)
          .toLocaleDateString();

      if (!map[date]) {
        map[date] = [];
      }

      map[date].push(item.main.aqi);

    });

    const historyData =
      Object.entries(map).map(
        ([date, vals]) => ({

          date,

          aqi: Math.round(
            vals.reduce((a, b) => a + b, 0)
            / vals.length
          )

        })
      );

    const aqi =
      current.main.aqi;

    const pollution =
      current.components;

    const civicScore =
      Math.max(
        0,
        100 - (
          aqi * 15
          + pollution.pm2_5 * 0.2
        )
      );

    db.query(
      `INSERT INTO searches
      (location, aqi, civic_score)
      VALUES (?, ?, ?)`,
      [
        location,
        aqi,
        civicScore
      ],
      (err) => {
        if (err) {
          console.log("Search save error:", err);
        }
      }
    );

    res.json({
      location,
      latitude: lat,
      longitude: lng,
      aqi,
      civicScore,
      pollution,
      history: historyData
    });

  } catch (err) {

    console.error(
      err.response?.data || err.message
    );

    res.status(500).json({
      error: "API error"
    });

  }

});
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});