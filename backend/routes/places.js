import express from "express"



const express = require("express");
const router = express.Router();
 
const COUNTRY_CODE = "dz";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
 
  if (q.length < 3) {
    return res.json([]);
  }
 
  const url =
    `${NOMINATIM_URL}?q=${encodeURIComponent(q)}` +
    `&format=json&addressdetails=1&limit=6` +
    (COUNTRY_CODE ? `&countrycodes=${COUNTRY_CODE}` : "");
 
  try {
    const response = await fetch(url, {
      headers: {
        // Server-side fetch (Node) actually respects this header, unlike RN.
        "User-Agent": "OXMVP/1.0 (contact: your-email@example.com)",
      },
    });
 
    if (!response.ok) {
      return res.status(502).json({ error: `Nominatim error: ${response.status}` });
    }
 
    const data = await response.json();
 
    const formatted = data.map((item) => ({
      place_id: item.place_id,
      description: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
 
    res.json(formatted);
  } catch (err) {
    console.error("Places search error:", err);
    res.status(500).json({ error: "Places search failed" });
  }
});
 
module.exports = router;