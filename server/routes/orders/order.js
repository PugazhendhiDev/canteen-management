const express = require("express");
const router = express.Router();

function Order(supabase) {
  router.post("/api/order", async (req, res) => {
    try {
      const { displayItems } = req.body;

      if (
        !displayItems ||
        !Array.isArray(displayItems) ||
        displayItems.length === 0
      ) {
        return res.status(400).json({ error: "Invalid or empty order items." });
      }

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            uid: req.uid,
            food: displayItems,
            isDelivered: false,
          },
        ])
        .select();

      if (orderError) {
        return res.status(500).json({ error: orderError.message });
      }

      const { error: cartDeleteError } = await supabase
        .from("cart")
        .delete()
        .eq("uid", req.uid);

      if (cartDeleteError) {
        return res.status(500).json({ error: "Order placed, but failed to clear cart" });
      }

      for (const item of displayItems) {
        const { id, quantity } = item;

        const { error: updateError } = await supabase.rpc("decrease_food_quantity", {
          food_id: id,
          quantity_to_subtract: quantity,
        });

        if (updateError) {
          console.error(`Failed to update quantity for food ID ${id}:`, updateError);
        }
      }

      res.status(201).json({
        message: "Order placed successfully",
        order: orderData[0],
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = Order;
