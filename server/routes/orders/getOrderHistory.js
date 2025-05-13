const express = require("express");
const router = express.Router();

function GetOrderHistory(supabase) {
  router.get("/api/get-order-history", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("id, food, isDelivered")
        .eq("uid", req.uid);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Orders fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = GetOrderHistory;
