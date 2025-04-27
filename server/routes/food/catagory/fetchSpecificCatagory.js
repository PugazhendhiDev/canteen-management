const express = require("express");
const router = express.Router();

function FetchSpecificCatagory(supabase) {
  router.get("/api/admin/fetch-specific-catagory/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from("food_catagories")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Catagory fetched successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = FetchSpecificCatagory;
