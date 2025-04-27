const express = require("express");
const router = express.Router();

function FetchFoods(supabase) {
  router.get("/api/fetch-foods", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("food_list")
        .select("*");

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Food list fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchFoods;
