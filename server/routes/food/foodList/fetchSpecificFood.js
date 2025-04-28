const express = require("express");
const router = express.Router();

function FetchSpecificFood(supabase) {
  router.get("/api/admin/fetch-specific-food/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from("food_list")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Food fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchSpecificFood;
