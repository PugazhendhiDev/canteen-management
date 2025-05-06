const express = require("express");
const router = express.Router();

function GetQuantityOfSpecificFood(supabase) {
  router.get("/api/get-quantity-of-specific-food/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from("food_list")
        .select("quantity")
        .eq("id", id)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Quantity fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = GetQuantityOfSpecificFood;
