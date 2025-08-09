// app.js
require('dotenv').config();
const express = require('express');
const Joi = require('joi');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// validation schema
const schoolSchema = Joi.object({
  name: Joi.string().trim().max(255).required(),
  address: Joi.string().trim().max(255).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

// Haversine distance (km)
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * POST /addSchool
 * body: { name, address, latitude, longitude }
 */
app.post('/addSchool', async (req, res) => {
  try {
    const { error, value } = schoolSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, address, latitude, longitude } = value;

    const [result] = await pool.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );

    return res.status(201).json({
      id: result.insertId,
      message: 'School added successfully'
    });
  } catch (err) {
    console.error('addSchool error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /listSchools?latitude=..&longitude=..
 * returns all schools sorted by distance from provided coords
 */
app.get('/listSchools', async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (Number.isNaN(userLat) || Number.isNaN(userLon)) {
      return res.status(400).json({ error: 'Query params latitude and longitude are required and must be numbers.' });
    }

    // Option A: fetch all and compute distances in JS (simple, good for small datasets)
    const [rows] = await pool.execute('SELECT id, name, address, latitude, longitude FROM schools');

    const withDistance = rows.map(r => ({
      ...r,
      distance_km: Number(haversine(userLat, userLon, r.latitude, r.longitude).toFixed(3))
    }));

    withDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.json({ count: withDistance.length, schools: withDistance });

    // Option B (commented): SQL-level sorting using Haversine / great-circle formula
    // This is more efficient for large tables because sorting/filtering happens in DB.
    // const limit = 100;
    // const sql = `
    // SELECT id, name, address, latitude, longitude,
    // (6371 * acos(
    //   cos(radians(?)) * cos(radians(latitude)) *
    //   cos(radians(longitude) - radians(?)) +
    //   sin(radians(?)) * sin(radians(latitude))
    // )) AS distance_km
    // FROM schools
    // ORDER BY distance_km ASC
    // LIMIT ?
    // `;
    // const [rows] = await pool.execute(sql, [userLat, userLon, userLat, limit]);
    // return res.json({ count: rows.length, schools: rows });
  } catch (err) {
    console.error('listSchools error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => res.send('School API running'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
