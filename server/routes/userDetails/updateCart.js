const express = require("express");
const router = express.Router();

function UpdateCart(supabase) {
  router.put("/api/update-cart", async (req, res) => {
    const { quantity, id } = req.body;

    try {
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("uid", uid)
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

module.exports = UpdateCart;
