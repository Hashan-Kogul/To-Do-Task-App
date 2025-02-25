const express = require("express");
const mariadb = require("mariadb");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5,
});

// Test DB Connection
pool.getConnection()
    .then(conn => {
        console.log("Connected to MariaDB");
        conn.release();
    })
    .catch(err => console.error("DB Connection Error:", err));

// API Endpoints
app.post("/tasks", async (req, res) => {
    const { title, description } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO task (title, description) VALUES (?, ?)", [title, description]);
        res.status(201).json({ message: "Task added" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// GET
app.get("/tasks", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM task WHERE completed = 0 ORDER BY created_at DESC LIMIT 5");
        res.json(rows);
    } catch (err) {
        console.error("Error in GET /tasks:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

// PATCH
app.patch("/tasks/:id/complete", async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("UPDATE task SET completed = 1 WHERE id = ?", [id]);
        res.json({ message: "Task marked as complete" });
    } catch (err) {
        console.error("Error in PATCH /tasks/:id/complete:", err);
        res.status(500).json({ error: err.message });
    } finally {
        if (conn) conn.release();
    }
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));