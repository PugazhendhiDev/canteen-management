const express = require("express");
const router = express.Router();

function GetUserOrder(supabase) {
  router.get("/api/get-user-order/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { data, error } = await supabase
        .from("orders")
        .select("id, food")
        .eq("isDelivered", false)
        .eq("uid", id);

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

module.exports = GetUserOrder;
