const express = require("express");
const router = express.Router();
const db = require("./db");

// ➤ Add School API
router.post("/addSchool", async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || latitude == null || longitude == null) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            return res.status(400).json({ error: "Invalid latitude (-90 to 90) or longitude (-180 to 180)." });
        }

        const query = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(query, [name, address, lat, lon]);

        res.json({ message: "School added successfully", schoolId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

// ➤ List Schools API
router.get("/listSchools", async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Latitude and Longitude are required." });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: "Invalid latitude or longitude values." });
        }

        const query = `SELECT *, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) 
            + sin(radians(?)) * sin(radians(latitude)))) AS distance 
            FROM schools ORDER BY distance ASC`;
        
        const [results] = await db.execute(query, [lat, lon, lat]);
        
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Database error: " + error.message });
    }
});

module.exports = router;
