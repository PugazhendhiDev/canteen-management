const express = require("express");
const router = express.Router();

function GetCartItems(supabase) {
  router.get("/api/get-cart-items", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `id,
          created_at,
          quantity,
          food_list (
            id,
            name,
            rate,
            quantity,
            image_link
          )`
        )
        .eq("uid", req.uid);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Cart items fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = GetCartItems;
