// routes/places.js
import express from "express";
const router = express.Router();

const COUNTRY_CODE = "dz";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// GET /api/places/search?q=some+address
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
        "User-Agent": "OXMVP/1.0 (contact: yourrealemail@gmail.com)",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Nominatim error: ${response.status}` });
    }

    const data = await response.json();
     const stripTifinagh = (text) =>
      text
        .replace(/[\u2D30-\u2D7F]+/g, "")
        .replace(/\s*,\s*,/g, ",")
        .replace(/\s{2,}/g, " ")
        .replace(/^,\s*|,\s*$/g, "")
        .trim();
 

    const formatted = data.map((item) => ({
      place_id: item.place_id,
      description: stripTifinagh(item.display_name),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Places search error:", err);
    res.status(500).json({ error: "Places search failed" });
  }
});

export default router;