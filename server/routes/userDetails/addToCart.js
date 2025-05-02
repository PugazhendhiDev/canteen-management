const express = require("express");
const router = express.Router();

function AddToCart(supabase) {
  router.post("/api/add-to-cart", async (req, res) => {
    const { quantity, food_id } = req.body;
    try {
      const { data, error } = await supabase
        .from("cart")
        .insert([{ uid: req.uid, quantity, food_id }])
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(201).json({
        message: "Item added to cart successfully",
        user: data[0],
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = AddToCart;
