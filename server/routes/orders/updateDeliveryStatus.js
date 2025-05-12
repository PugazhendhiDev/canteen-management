const express = require("express");
const router = express.Router();

function UpdateDeliveryStatus(supabase) {
  router.put("/api/update-delivery-status", async (req, res) => {
    const { id } = req.body;

    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ isDelivered: true })
        .eq("id", id)
        .select();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Status updated successfully",
        user: data[0],
      });
    } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = UpdateDeliveryStatus;
