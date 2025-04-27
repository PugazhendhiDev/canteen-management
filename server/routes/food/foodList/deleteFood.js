const express = require("express");
const router = express.Router();

function DeleteFood(supabase) {
  router.delete("/api/admin/delete-food", async (req, res) => {
    const { id } = req.body;

    try {
      const { data, error } = await supabase
        .from("food_list")
        .delete()
        .eq("id", id);

      if (error) return res.status(500).json({ error: error.message });

      res.status(200).json({
        message: "Food deleted",
      });
    } catch (error) {
      console.error("Error deleting food:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

module.exports = DeleteFood;
