const express = require("express");
const router = express.Router();

function FetchCatagories(supabase) {
  router.get("/api/fetch-catagories", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .select("*")
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Catagories fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchCatagories;
