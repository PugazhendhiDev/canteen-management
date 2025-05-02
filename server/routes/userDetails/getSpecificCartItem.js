const express = require("express");
const router = express.Router();

function GetSpecificCartItem(supabase) {
  router.get("/api/get-specific-cart-item/:food_id", async (req, res) => {
    const { food_id } = req.params;
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("uid", req.uid)
        .eq("food_id", food_id)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Cart item fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = GetSpecificCartItem;
