const express = require("express");
const router = express.Router();

function DeleteCartItem(supabase) {
  router.delete("/api/delete-item-in-cart", async (req, res) => {
    const { food_id } = req.body;

    try {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("food_id", food_id)
        .eq("uid", req.uid);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Cart deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = DeleteCartItem;
