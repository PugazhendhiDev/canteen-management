const express = require("express");
const router = express.Router();

function QuantityUpdate(supabase) {
  router.put("/api/update-quantity", async (req, res) => {
    const { id, quantity } = req.body;

    if (quantity < 1) {
      res.status(500).json({ error: "Internal server error" });
    }

    try {
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: quantity })
        .eq("uid", req.uid)
        .eq("id", id)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Cart updated successfully",
        user: data[0],
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = QuantityUpdate;
