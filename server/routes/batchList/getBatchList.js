const express = require("express");
const router = express.Router();

function GetBatchList(supabase) {
  router.get("/api/get-batch-list", async (req, res) => {
    try {

      const { data, error } = await supabase
        .from("batch")
        .select("*");

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "batch list fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching batch list:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = GetBatchList;
