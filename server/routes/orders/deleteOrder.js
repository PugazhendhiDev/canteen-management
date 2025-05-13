const express = require("express");
const router = express.Router();

function DeleteOrder(supabase) {
  router.delete("/api/delete-order", async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    try {
      const { data: orderData, error: fetchError } = await supabase
        .from("orders")
        .select("food, uid, isDelivered")
        .eq("id", id)
        .eq("uid", req.uid)
        .single();

      if (fetchError || !orderData) {
        return res.status(404).json({ error: "Order not found." });
      }

      const { food, uid, isDelivered } = orderData;

      if (isDelivered) {
        return res
          .status(400)
          .json({ error: "This order is already delivered." });
      }

      for (const item of food) {
        const { id: foodId, quantity } = item;

        const { error: restoreError } = await supabase.rpc(
          "increase_food_quantity",
          {
            food_id: foodId,
            quantity_to_add: quantity,
          }
        );

        if (restoreError) {
          console.error(
            `Failed to restore food quantity for ${foodId}`,
            restoreError
          );
        }
      }

      const refundAmount = food.reduce((total, item) => {
        return total + item.rate * item.quantity;
      }, 0);

      const { error: walletError } = await supabase.rpc("add_to_wallet", {
        user_id: uid,
        amount_to_add: refundAmount,
      });

      if (walletError) {
        return res.status(500).json({ error: walletError.message });
      }

      const { data: deletedData, error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id)
        .eq("uid", req.uid)
        .select();

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      res.status(200).json({
        message: "Order deleted, food restored, and amount refunded.",
        deletedOrder: deletedData[0],
      });
    } catch (err) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  return router;
}

module.exports = DeleteOrder;
