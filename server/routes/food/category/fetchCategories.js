const express = require("express");
const router = express.Router();

function FetchCategories(supabase) {
  router.get("/api/fetch-categories", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("food_categories")
        .select("*");

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "categories fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchCategories;
