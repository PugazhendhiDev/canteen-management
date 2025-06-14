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

      let totalCost = 0;

      for (const item of displayItems) {
        const { id, quantity } = item;

        const { data: foodData, error: fetchError } = await supabase
          .from("food_list")
          .select("quantity, name, rate")
          .eq("id", id)
          .single();

        if (fetchError || !foodData) {
          return res
            .status(400)
            .json({ error: `Failed to fetch food item with ID ${id}` });
        }

        if (foodData.quantity < quantity) {
          return res.status(400).json({
            error: `Insufficient stock for '${foodData.name}'. Only ${foodData.quantity} left.`,
          });
        }

        totalCost += foodData.rate * quantity;
      }

      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("amount")
        .eq("uid", req.uid)
        .single();

      if (userError || !userData) {
        return res.status(400).json({ error: "Failed to fetch user wallet." });
      }

      if (userData.amount < totalCost) {
        return res.status(400).json({
          error: `Insufficient wallet balance. Total: ₹${totalCost}, Available: ₹${userData.amount}`,
        });
      }

      const newAmount = userData.amount - totalCost;
      const { error: walletError } = await supabase
        .from("user_data")
        .update({ amount: newAmount })
        .eq("uid", req.uid);

      if (walletError) {
        return res.status(500).json({ error: "Failed to update wallet." });
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
        return res
          .status(500)
          .json({ error: "Order placed, but failed to clear cart" });
      }

      for (const item of displayItems) {
        const { id, quantity } = item;
        await supabase.rpc("decrease_food_quantity", {
          food_id: id,
          quantity_to_subtract: quantity,
        });
      }

      res.status(201).json({
        message: "Order placed successfully. ₹" + totalCost + " deducted.",
        order: orderData[0],
      });
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = Order;
