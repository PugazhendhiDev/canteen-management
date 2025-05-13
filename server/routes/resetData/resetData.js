const express = require("express");
const router = express.Router();

function ResetData(supabase) {
  router.get("/api/reset-data", async (req, res) => {
    try {
      const { data: orders, error: fetchError } = await supabase
        .from("orders")
        .select("id, uid, food")
        .eq("isDelivered", false);

      if (fetchError) throw fetchError;

      for (const order of orders) {
        const { id, uid, food } = order;

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
              `Failed to restore quantity for food ID ${foodId}:`,
              restoreError.message
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
          console.error(`Failed to refund user ${uid}:`, walletError.message);
        }

        const { error: deleteError } = await supabase
          .from("orders")
          .delete()
          .eq("id", id);

        if (deleteError) {
          console.error(`Failed to delete order ${id}:`, deleteError.message);
        } else {
          console.log(
            `Deleted order ID: ${id} and processed refund for USER: ${uid}`
          );
        }
      }

      console.log("All undelivered orders handled.");
    } catch (err) {
      console.error("Script failed:", err.message);
    }
  });

  return router;
}

module.exports = ResetData;
